import { Module } from "@nestjs/common";
import { AppService } from "src/app.service";
import { MovieController } from "src/movies/movie.controller";
import { MovieService } from "src/movies/movie.service";

@Module({
    providers: [AppService, MovieService],
    controllers: [MovieController]
})

export class MovieModule {}