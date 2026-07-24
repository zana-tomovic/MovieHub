import { Injectable, UseFilters } from "@nestjs/common";
import { AppService } from "src/app.service";
import { Subject } from "./notification";

@Injectable()
export class NotificationService {
    constructor(private readonly appService: AppService) {}

    async getNotifications(username: string) {
        const query = `
            for user in users
            filter user.username == "${username}"
            for v in inbound user hasNotification
            return v
        `

        const cursor = await this.appService.db.query(query);
        return await cursor.all();
    }

    async createNotification(
        by_user: string,
        to_user: string,
        subject: Subject
    ) {
        let message = ""

        if (subject == Subject.Followed) {
            message = "You have been followed by " + by_user; 
        } else if (subject == Subject.Liked) {
            message = "Your review has been liked by " + by_user; 
        } 

        const notificationData = {
                by_user,
                subject,
                message,
                createdAt: new Date().toISOString(),
                seen: false
        }

        const cursor1 = await this.appService.db.query(
            `insert @notificationData into notifications RETURN NEW`, {notificationData}
        )

        const newNotification = await cursor1.next();

        if (newNotification) {
            await this.appService.db.query(
                `  insert {
                    _from: "${newNotification._id}",
                    _to: "users/${to_user}"
                    } into hasNotification
                `   
            )
        }
    }

    async setSeen(key: string) {
        const query = `
            for notification in notifications
            filter notification._key == @key
            update notification with {
                seen: true
            } in notifications
            return NEW
        `

        const cursor = await this.appService.db.query(query, {key})
        return await cursor.next();
    }
}