import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { AppService } from 'src/app.service';

import { MovieService } from 'src/movies/services/movie.service';
import { MovieUserService } from 'src/movies/services/movie-user.service';

import { UserService } from 'src/users/user.service';

@Module({
  providers: [AppService, ReviewService, MovieService, MovieUserService, UserService],
  controllers: [ReviewController]
})
export class ReviewModule {}
