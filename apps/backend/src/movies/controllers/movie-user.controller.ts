import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { MovieUserService } from "../services/movie-user.service";

@Controller('movies')
export class MovieUserController {
    constructor(private readonly movieUserService: MovieUserService) {}

    @Get('user/:username')
    async getAll(@Param('username') username: string) {
        return this.movieUserService.getAll(username);
    }

    @Get('saved/:username')
    async getSaved(@Param('username') username: string) {
        return this.movieUserService.getSaved(username);
    }

    @Post('saved/:key')
    async saveMovie(@Param('key') key: string, @Body('username') username: string) {
        return this.movieUserService.saveMovie(key, username);
    }

    @Delete('saved/:key')
      async removeSaved(@Param('key') key: string, @Body('username') username: string) {
        return this.movieUserService.removeSaved(key, username);
    }

    @Get('seen/:username')
    async getSeen(@Param('username') username: string) {
        return this.movieUserService.getSeen(username);
    }

    @Post('seen/:key')
    async setMovieToSeen(@Param('key') key: string, @Body('username') username: string) {
        return this.movieUserService.setMovieToSeen(key, username);
    }

    @Delete('seen/:key')
    async removeSeen(@Param('key') key: string, @Body('username') username: string) {
        return this.movieUserService.removeSeen(key, username);
    }
}