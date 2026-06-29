import { Module } from "@nestjs/common";
import { MovieService } from "src/movies/services/movie.service";
import { MovieUserService } from "src/movies/services/movie-user.service";
import { ReviewService } from "src/reviews/review.service";
import { UserController } from "src/users/user.controller";
import { UserService } from "src/users/user.service";

@Module({
    controllers: [UserController],
    providers: [UserService, MovieService, MovieUserService, ReviewService],
    exports: [UserService]
})
export class UserModule {}