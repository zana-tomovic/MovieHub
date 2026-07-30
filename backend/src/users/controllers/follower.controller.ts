import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { FollowerService } from "../services/follower.service";

@Controller('followers')
export class FollowerController {
    constructor(private readonly followerService: FollowerService) {}
    
    @UseGuards(AuthGuard)
    @Get('isFollower')
    async isFollower(
        @Query('followerId') followerId: string,
        @Query('followedId') followedId: string
    ) {
    return this.followerService.getIsFollowed(followerId, followedId);
    }

    @UseGuards(AuthGuard)
    @Get()
    async getFollowers(@Query('id') id: string,) {
        return await this.followerService.getFollowers(id);
    }

    @UseGuards(AuthGuard)
    @Get("followed")
    async getFollowed(@Query('id') id: string,) {
        return await this.followerService.getFollowed(id);
    }

    @UseGuards(AuthGuard)
    @Post()
    async followUser(@Body() body: { followerId: string, followedId: string }) {
        return this.followerService.followUser(
            body.followerId,
            body.followedId
        );
    }

    @UseGuards(AuthGuard)
    @Delete()
    async unfollowUser(@Body() body: { followerId: string, followedId: string }) {
        return this.followerService.unfollowUser(
            body.followerId,
            body.followedId
        );
    }
}