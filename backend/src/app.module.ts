import { Global, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

import { UserModule } from './users/user.module';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';

import { MovieModule } from './movies/movie.module';
import { MovieController } from './movies/movie.controller';
import { MovieService } from './movies/movie.service';

import { ReviewService } from './reviews/review.service';
import { ReviewModule } from './reviews/review.module';
import { ReviewController } from './reviews/review.controller';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, MovieModule, ReviewModule],
  controllers: [AppController, AuthController, UserController, MovieController, ReviewController],
  providers: [AppService, AuthService, UserService, MovieService, ReviewService],
  exports: [AppService]
})
export class AppModule {}
