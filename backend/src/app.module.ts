import { Global, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

import { UserModule } from './users/user.module';
import { UserController } from './users/controllers/user.controller';
import { UserService } from './users/services/user.service';

import { MovieModule } from './movies/movie.module';
import { MovieController } from './movies/controllers/movie.controller';
import { MovieService } from './movies/services/movie.service';

import { ReviewModule } from './reviews/review.module';
import { MovieUserController } from './movies/controllers/movie-user.controller';
import { MovieUserService } from './movies/services/movie-user.service';
import { MovieRecController } from './movies/controllers/movie-rec.controller';
import { MovieRecService } from './movies/services/movie-rec.service';
import { ReviewUserController } from './reviews/controllers/review-user.controller';
import { ReviewUserService } from './reviews/services/review-user.service';
import { ReviewController } from './reviews/controllers/review.controller';
import { ReviewService } from './reviews/services/review.service';

import { NotificationController } from './notifications/notification.controller';
import { NotificationService } from './notifications/notification.service';
import { FollowerController } from './users/controllers/follower.controller';
import { FollowerService } from './users/services/follower.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, MovieModule, ReviewModule],
  controllers: [AppController, AuthController, UserController, MovieController, MovieUserController, MovieRecController, ReviewController, ReviewUserController, NotificationController, FollowerController],
  providers: [AppService, AuthService, UserService, MovieService, MovieUserService, MovieRecService, ReviewService, ReviewUserService, NotificationService, FollowerService],
  exports: [AppService]
})
export class AppModule {}
