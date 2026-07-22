import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { UserService } from "src/users/user.service";
import { User } from "./user";
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAll() {
        return await this.userService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':username')
    async getUser(@Param('username') username: string) {
        return await this.userService.findByUsername(username);
    }

    @Post('')
    register(@Body() user: User) {
        return this.userService.register(user);
    }

    @UseGuards(AuthGuard)
    @Patch()
    @UseInterceptors(FileInterceptor("image"))
    update(
        @UploadedFile() file: Express.Multer.File,
        @Body() user: Partial<User>
    ) {
        if (file) {
            user.image = `/uploads/${file.filename}`;
        }

        return this.userService.update(user);
    }

    @UseGuards(AuthGuard)
    @Delete(':username')
    delete(@Param('username') username: string) {
        return this.userService.delete(username);
    }
}