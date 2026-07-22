import { Module } from '@nestjs/common';
import { ReviewService } from './services/review.service';
import { ReviewController } from './controllers/review.controller';
import { AppService } from 'src/app.service';

import { MovieService } from 'src/movies/services/movie.service';
import { MovieUserService } from 'src/movies/services/movie-user.service';

import { UserService } from 'src/users/user.service';
import { ReviewUserController } from './controllers/review-user.controller';
import { ReviewUserService } from './services/review-user.service';

@Module({
  providers: [AppService, ReviewService, ReviewUserService, MovieService, MovieUserService, UserService],
  controllers: [ReviewController, ReviewUserController]
})
export class ReviewModule {}
