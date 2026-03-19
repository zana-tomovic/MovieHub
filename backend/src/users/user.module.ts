import { Module } from "@nestjs/common";
import { AppModule } from "src/app.module";
import { MovieService } from "src/movies/movie.service";
import { ReviewService } from "src/reviews/review.service";
import { UserController } from "src/users/user.controller";
import { UserService } from "src/users/user.service";

@Module({
    controllers: [UserController],
    providers: [UserService, MovieService, ReviewService],
    exports: [UserService]
})
export class UserModule {}