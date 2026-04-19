import { Controller, Get, Param, Query } from "@nestjs/common";
import { MovieService } from "./movie.service";

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get()
    searchByName(@Query('title') name?: string) {
        return this.movieService.searchByName(name);
    }

    // @Get('search/decade')
    // searchByDecade(@Query('decade') decade: string) {
    //     return this.movieService.searchByDecade(decade);
    // }

    // @Get('search/rating')
    // searchByRating(@Query('rating') rating: string) {
    //     return this.movieService.searchByRating(rating);
    // }

    // @Get('search/genre')
    // searchByGenre(@Query('genre') genre: string) {
    //     return this.movieService.searchByGenre(genre);
    // }

    @Get('search')
    searchByChoice(@Query('decade') decade?: string, @Query('rating') rating?: string, @Query('genre') genre?: string) {
        return this.movieService.searchByChoice({decade, rating, genre});
    }

    @Get(':id')
    async getMovie(@Param('id') id: string) {
        return this.movieService.findById(id);
    }
}