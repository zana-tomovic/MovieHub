import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './review';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}
    
    @Get('user/:username')
    async getUserReviews(@Param('username') username: string) {
        return await this.reviewService.findReviewsByUser(username);
    }

    @Get(':movieKey')
    async getReviews(@Param('movieKey') movieKey: string) {
        return await this.reviewService.findReviews(movieKey);
    }
    
    @UseGuards(AuthGuard)
    @Post(':movieKey')
    create(@Body() review: Review, @Param('movieKey') movieKey: string) {
        return this.reviewService.create(review, movieKey);
    }

    @UseGuards(AuthGuard)
    @Patch()
    update(@Body() review: Partial<Review>) {
        return this.reviewService.update(review);
    }

    @UseGuards(AuthGuard)
    @Delete(':key')
    delete(@Param('key') key: string) {
        return this.reviewService.delete(key);
    }
}
