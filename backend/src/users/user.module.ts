import { Module } from "@nestjs/common";
import { MovieService } from "src/movies/services/movie.service";
import { MovieUserService } from "src/movies/services/movie-user.service";
import { ReviewUserService } from "src/reviews/services/review-user.service";
import { UserController } from "src/users/controllers/user.controller";
import { UserService } from "src/users/services/user.service";
import { FollowerController } from "./controllers/follower.controller";
import { FollowerService } from "./services/follower.service";
import { NotificationController } from "src/notifications/notification.controller";
import { NotificationService } from "src/notifications/notification.service";

@Module({
    controllers: [UserController, FollowerController, NotificationController],
    providers: [UserService, MovieService, MovieUserService, ReviewUserService, FollowerService, NotificationService],
    exports: [UserService]
})
export class UserModule {}