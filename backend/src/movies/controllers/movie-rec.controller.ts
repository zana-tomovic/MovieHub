import { Controller, Get, Param } from "@nestjs/common";
import { MovieRecService } from "../services/movie-rec.service";

@Controller('movies')
export class MovieRecController {
    constructor(private readonly movieRecService: MovieRecService) {}

    @Get('recs/new')
    async getNew() {
        return this.movieRecService.getNew();
    }

    @Get('recs/popular')
    async getPopular() {
        return this.movieRecService.getPopular();
    } 
  
    @Get('recs/user/:username')  
    async getRecForUser(@Param('username') username: string) {
        return this.movieRecService.getRecForUser(username);
    }

    @Get('recs/key/:key')
    async getRec(@Param('key') key: string) {
        return this.movieRecService.getRec(key);
    } 
}