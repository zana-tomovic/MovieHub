import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { AuthGuard } from "./auth.guard";

export class LoginUserDto {
    username: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto.username, loginUserDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('loggedUser')
    getLoggedUser(@Request() req) {
        return req.user;
    }
}