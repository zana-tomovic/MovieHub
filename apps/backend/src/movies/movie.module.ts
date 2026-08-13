import { Module } from "@nestjs/common";
import { AppService } from "src/app.service";
import { MovieController } from "src/movies/controllers/movie.controller";
import { MovieService } from "src/movies/services/movie.service";
import { MovieUserService } from "./services/movie-user.service";
import { MovieRecController } from "./controllers/movie-rec.controller";
import { MovieRecService } from "./services/movie-rec.service";
import { MovieUserController } from "./controllers/movie-user.controller";

@Module({
    providers: [AppService, MovieService, MovieUserService, MovieRecService],
    controllers: [MovieController, MovieUserController, MovieRecController]
})

export class MovieModule {}