import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { MovieService } from "../services/movie.service";

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get('search')
    searchByTitle(@Query('title') title?: string) {
        return this.movieService.searchByTitle(title);
    }

    @Get('filter')
    searchByChoice(@Query('decade') decade?: string, @Query('rating') rating?: string, @Query('genre') genre?: string) {
        return this.movieService.searchByChoice({decade, rating, genre});
    }

    @Get(':key')
    async getByKey(@Param('key') key: string) {
        return this.movieService.findByKey(key);
    }
}