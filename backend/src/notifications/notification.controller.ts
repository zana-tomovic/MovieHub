import { Controller, Get, Param, Post } from "@nestjs/common";
import { NotificationService } from "./notification.service";

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get('/user/:username')
    async getNotifications(@Param('username') username: string) {
        return this.notificationService.getNotifications(username);
    }

    @Post('/:key')
    async setSeen(@Param('key') key: string) {
        return this.notificationService.setSeen(key);
    }
}