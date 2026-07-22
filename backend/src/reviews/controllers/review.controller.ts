import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from '../services/review.service';

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}
    
    @Get('popular')
    async getPopular() {
        return this.reviewService.getPopular();
    }

    @Get('liked/user/:username')
    async getLikes(@Param('username') username: string) {
        return this.reviewService.getLikes(username);
    }

    @Get('liked/:key')
    async getLikesByUsers(@Param('key') key: string) {
        return this.reviewService.getLikesByUsers(key);
    }

    @Get(':movieKey')
    async getReviews(@Param('movieKey') movieKey: string) {
        return await this.reviewService.findReviews(movieKey);
    }

    @Post('liked/:key')
    async likeReview(@Param('key') key: string, @Body('username') username: string) {
        return this.reviewService.likeReview(key, username);
    }

    @Delete('liked/:key')
    async removeLiked(@Param('key') key: string, @Body('username') username: string) {
        return this.reviewService.removeLiked(key, username)
    }
}
