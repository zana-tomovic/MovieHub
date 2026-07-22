import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Review } from '../review';
import { ReviewUserService } from '../services/review-user.service';

@Controller('reviews')
export class ReviewUserController {
    constructor(private readonly reviewUserService: ReviewUserService) {}
    
    @Get('user/:username')
    async getUserReviews(@Param('username') username: string) {
        return await this.reviewUserService.findReviewsByUser(username);
    }

    @UseGuards(AuthGuard)
    @Post(':movieKey')
    create(@Body() review: Review, @Param('movieKey') movieKey: string) {
        return this.reviewUserService.create(review, movieKey);
    }

    @UseGuards(AuthGuard)
    @Patch()
    update(@Body() review: Partial<Review>) {
        return this.reviewUserService.update(review);
    }

    @UseGuards(AuthGuard)
    @Delete(':key')
    delete(@Param('key') key: string) {
        return this.reviewUserService.delete(key);
    }
}