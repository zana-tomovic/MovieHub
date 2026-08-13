import { Injectable } from "@nestjs/common";
import { AppService } from "src/app.service";
import { Subject } from "src/notifications/notification";
import { NotificationService } from "src/notifications/notification.service";

@Injectable()
export class FollowerService {
    constructor(
        private readonly appService: AppService,
        private readonly notificationService: NotificationService
    ) {}

    async getFollowers(id: string) {
        const query = `
            for user in users
            filter user._id == @id
            for v in inbound user hasFollower
            return v
        `

        const cursor = await this.appService.db.query(query, {id});
        return await cursor.all();
    }

    async getFollowed(id: string) {
        const query = `
            for user in users
            filter user._id == @id
            for v in outbound user hasFollower
            return v
        `

        const cursor = await this.appService.db.query(query, {id});
        return await cursor.all();
    }

    async getIsFollowed(followerId: string, followedId: string) {
        const query = `
            for follower in hasFollower
            filter follower._from == @followerId and follower._to == @followedId
            return true
        `

        const cursor = await this.appService.db.query(query, {followerId, followedId})

        const result = await cursor.next();

        return result == true;
    }

    async followUser(followerId: string, followedId: string) {
        const query = `
            insert {
                _from: @followerId,
                _to: @followedId
            } into hasFollower
        `;


        const follower_user_cursor = await this.appService.db.query(`
            for user in users
            filter user._id == @followerId
            return user
        `, {followerId})

        const followed_user_cursor = await this.appService.db.query(`
            for user in users
            filter user._id == @followedId
            return user
        `, {followedId})

        const follower = await follower_user_cursor.next();
        
        const followed = await followed_user_cursor.next();

        await this.appService.db.query(query, {followerId, followedId})
        
        await this.updateFollowerCount(followerId);

        await this.notificationService.createNotification(follower.username, followed._key, Subject.Followed);

        return await this.updateFollowerCount(followedId);
    }

    async unfollowUser(followerId: string, followedId: string) {
        const query = `
              for follower in hasFollower
              filter follower._from == @followerId and follower._to == @followedId
              remove follower IN hasFollower
        `;

        await this.appService.db.query(query, {followerId, followedId});
       
        await this.updateFollowerCount(followerId);
        return await this.updateFollowerCount(followedId);
    }

    async updateFollowerCount(id: string) {
        const query = `
            let followers = (
                for follower in hasFollower
                filter follower._to == @id
                return follower
            )

            let followed = (
                for follower in hasFollower
                filter follower._from == @id
                return follower
            )

            for user in users
            filter user._id == @id   
            update user with {
                num_followers: length(followers),
                num_followed: length(followed)
            } in users
            return NEW
        `;

        const cursor = await this.appService.db.query(query, {id});
        return await cursor.next();
    }
}