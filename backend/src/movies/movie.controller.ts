import { Controller, Get, Param, Query } from "@nestjs/common";
import { MovieService } from "src/movies/movie.service";

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get()
    search(@Query('title') name?: string) {
        return this.movieService.search(name);
    }

    @Get(':id')
    async getMovie(@Param('id') id: string) {
        return this.movieService.findById(id);
    }
}