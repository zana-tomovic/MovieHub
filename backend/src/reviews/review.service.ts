import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { Review } from './review';
import { MovieService } from 'src/movies/movie.service';
import { aql } from 'arangojs';

@Injectable()
export class ReviewService {
    constructor(private readonly appService: AppService,
                private movieService: MovieService) {}

    async findAllReviews(movieId?: string) {
        const query = `
            let movie = document(concat("movies/", @movieId))
            for v in outbound movie hasReview
            return merge(v, {movie: movie.Title})
        `;

        const cursor = await this.appService.db.query(query, {movieId});

        return await cursor.all();
    }

    async findReviewsByUser(username: string) {
        const query = `
            for r in reviews
            filter r.username == @username
            let movie = (
                for v in inbound r hasReview 
                return v
            )[0]
            return merge(r, {movie: movie.Title})
        `

        const cursor = await this.appService.db.query(query, {username});

        return cursor.all();
    }

    async create(review: Review, movieId: string) {
        const cursor1 = await this.appService.db.query(`return document(concat("movies/", @movieId)).Title`, {movieId});
        
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
                `insert {
                  _from: "movies/${movieId}",
                  _to: "${newReview._id}"
                } into hasReview`
            );
        }

        await this.movieService.updateMovieRating(movieId);

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
        
        const movieId = await cursor1.next();

        const cursor2 = await this.appService.db.query(aql `
            for r in reviews
            filter r._id == ${_id}
            update r with ${updatedReview} in reviews
            RETURN NEW
        `);
        
        await this.movieService.updateMovieRating(movieId);
        
        return await cursor2.next();
    }

    async delete(id: string) {
        const cursor = await this.appService.db.query(`
            for r in reviews 
            filter r._key == ${id} 
            for v in inbound r hasReview
            return v._key
        `);

        const movieId = await cursor.next();

        await this.appService.db.query(`
            for e in hasReview 
            filter e._to == "reviews/${id}"  
            remove e in hasReview
        `);

        await this.appService.db.query(`
            for r in reviews
            filter r._key == "${id}"
            remove r in reviews
        `);

        await this.movieService.updateMovieRating(movieId);

        return { message: 'Recenzija je izbrisana.'};
    }    
}
