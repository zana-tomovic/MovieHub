import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './review';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}
    
    @Get(':movieId')
    async getAll(@Param('movieId') movieId: string) {
        return await this.reviewService.findAllReviews(movieId);
    }

    @Get('/user/:username')
    async getUserReviews(@Param('username') username: string) {
        return await this.reviewService.findReviewsByUser(username);
    }

    @UseGuards(AuthGuard)
    @Post(':movieId')
    createReview(@Body() review: Review, @Param('movieId') movieId: string) {
        return this.reviewService.create(review, movieId);
    }

    @UseGuards(AuthGuard)
    @Patch('/update')
    update(@Body() review: Partial<Review>) {
        return this.reviewService.update(review);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.reviewService.delete(id);
    }
}
