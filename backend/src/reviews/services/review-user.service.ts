import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { Review } from '../review';
import { MovieService } from 'src/movies/services/movie.service';
import { MovieUserService } from 'src/movies/services/movie-user.service';
import { aql } from 'arangojs';

@Injectable()
export class ReviewUserService {
    constructor(
                private readonly appService: AppService,
                private movieService: MovieService,
                private movieUserService: MovieUserService
            ) {}

    async findReviewsByUser(username: string) {
        const query = `
            for r in reviews
            filter r.username == @username
            let movie = (
                for v in inbound r hasReview 
                return v
            )[0]

            return merge(r, {movie_key: movie._key}, {movie: movie.Title}, {date: movie.Release_Date}, {poster: movie.Poster_Url})
        `

        const cursor = await this.appService.db.query(query, {username});

        return cursor.all();
    }

    async create(review: Review, movieKey: string) {
        const cursor1 = await this.appService.db.query(`return document(concat("movies/", @movieKey)).Title`, {movieKey});
        
        const movie = await cursor1.next();
        
        const reviewData = {
            ...review,
            movie: movie,
            createdAt: new Date().toISOString()
        }

        const cursor2 = await this.appService.db.query(
            `insert @reviewData into reviews RETURN NEW`, {reviewData}
        );

        const newReview = await cursor2.next();

        if (newReview) {
            await this.appService.db.query(
                `  insert {
                    _from: "movies/${movieKey}",
                    _to: "${newReview._id}"
                    } into hasReview
                `
            );
        }

        await this.movieService.updateRating(movieKey);

        await this.movieUserService.setMovieToSeen(movieKey, reviewData.username);

        return newReview;
    }

    async update(review: Partial<Review>) {
        const {_id, _key, ...updatedReview} = review;
        
        const cursor1 = await this.appService.db.query(aql `
            for r in reviews 
            filter r._id == ${review._id} 
            for v in inbound r hasReview
            return v._key
        `);
        
        const movieKey = await cursor1.next();

        const cursor2 = await this.appService.db.query(aql `
            for r in reviews
            filter r._id == ${_id}
            update r with ${updatedReview} in reviews
            RETURN NEW
        `);
        
        await this.movieService.updateRating(movieKey);
        
        return await cursor2.next();
    }

    async delete(key: string) {
        const cursor = await this.appService.db.query(`
            for r in reviews 
            filter r._key == "${key}" 
            for v in inbound r hasReview
            return v._key
        `);

        const movieKey = await cursor.next();

        await this.appService.db.query(`
            for h in hasReview 
            filter h._to == "reviews/${key}"  
            remove h in hasReview
        `);

        await this.appService.db.query(`
            for liked in hasLiked
            filter liked._to == "reviews/${key}"  
            remove liked in hasLiked
        `);

        await this.appService.db.query(`
            for r in reviews
            filter r._key == "${key}"
            remove r in reviews
        `);

        console.log("movieKey:", movieKey);

        await this.movieService.updateRating(movieKey);

        return { message: 'Review has been deleted.'};
    }    
}
