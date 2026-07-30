import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { NotificationService } from 'src/notifications/notification.service';
import { Subject } from 'src/notifications/notification';

@Injectable()
export class ReviewService {
    constructor(
                private readonly appService: AppService,
                private readonly notificationService: NotificationService
            ) {}

    async findReviews(movieKey?: string) {
        const query = `
            let movie = document(concat("movies/", @movieKey))
            for v in outbound movie hasReview
            let user = first(
                for user in users
                filter user.username == v.username
                return user
            )
            return merge(v, {movie: movie.Title}, {image: user.image})
        `;

        const cursor = await this.appService.db.query(query, {movieKey});

        return await cursor.all();
    }

    async getPopular() {    
        const query = `
            let today = date_trunc(date_now(), "day")    
            let day_of_week = date_dayofweek(today)
            let dif = (day_of_week == 0 ? 6 : day_of_week - 1)

            let start_ms = date_timestamp(date_subtract(today, dif, "day"))

            let end_ms = date_timestamp(date_add(start_ms, 7, "day"))

            for r in reviews
            let created_ms = date_timestamp(r.createdAt)
            filter created_ms >= start_ms and created_ms < end_ms
            let movie = (
                for v in inbound r hasReview 
                return v
            )[0]
            sort r.Num_Likes desc
            limit 2
            return merge(r, {movie_key: movie._key}, {date: movie.Release_Date}, {poster: movie.Poster_Url})
        `

        const cursor = await this.appService.db.query(query);
        return await cursor.all();
    }

    async getLikes(username: string) {
        const query = `
            let user = first(
                for u in users
                filter u.username == @username
                return u
            )

            for liked in hasLiked
            filter liked._from == user._id
            for r in reviews
            filter concat("reviews/", r._key) == liked._to
            return r
        `;

        const cursor = await this.appService.db.query(query, {username});
        
        return cursor.all();
    }

    async getLikesByUsers(key: string) {
        const query = `
            for r in reviews
            filter r._key == @key
            for v in inbound r hasLiked
            return unset(v, "password")
        `

        const cursor = await this.appService.db.query(query, {key})
        return await cursor.all();
    }

    async likeReview(key: string, username: string) {
        const review_user_cursor = await this.appService.db.query(
            `
                for r in reviews
                filter r._key == @key
                  for user in users
                  filter user.username == r.username
                  return user._key
            `,
            {key}
        );

        const review_user_key = await review_user_cursor.next();

        const query = `
            let user = first(
                for u in users
                filter u.username == @username
                return u 
            )

            let review = first(
                for r in reviews
                filter r._key == @key
                return r
            )

            filter user != null && review != null

            insert {
                _from: user._id,
                _to: review._id
            } into hasLiked
            RETURN NEW
        `;

        const cursor = await this.appService.db.query(query, {key, username});
        
        await cursor.next();
    
        await this.notificationService.createNotification(username, review_user_key, Subject.Liked);

        return await this.updateLikes(key);
    }

    async removeLiked(key: string, username: string) {
        const query = `
            let user = first(
                for u in users
                filter u.username == @username
                return u 
            )

            let review = first(
                for r in reviews
                filter r._key == @key
                return r
            )

            let liked = first(
                for liked in hasLiked
                filter liked._from == user._id
                filter liked._to == review._id
                return liked
            )

            remove liked in hasLiked    
        `

        const cursor = await this.appService.db.query(query, {key, username});
        await cursor.next();

        return await this.updateLikes(key);
    }

    async updateLikes(reviewKey : string) {
        const query = `
            for r in reviews
            filter r._key == "${reviewKey}"
            let likes = (
                for v in inbound r._id hasLiked
                return v
            )

            update r with {
                Num_Likes: length(likes)
            } in reviews
            return NEW
        `

        const cursor = await this.appService.db.query(query);
        return await cursor.next();
    }
}
