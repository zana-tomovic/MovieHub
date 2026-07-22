import { Module } from "@nestjs/common";
import { MovieService } from "src/movies/services/movie.service";
import { MovieUserService } from "src/movies/services/movie-user.service";
import { ReviewUserService } from "src/reviews/services/review-user.service";
import { UserController } from "src/users/user.controller";
import { UserService } from "src/users/user.service";

@Module({
    controllers: [UserController],
    providers: [UserService, MovieService, MovieUserService, ReviewUserService],
    exports: [UserService]
})
export class UserModule {}