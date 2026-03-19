import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AppService } from 'src/app.service';
import { MovieService } from 'src/movies/movie.service';
import { ReviewController } from './review.controller';
import { UserService } from 'src/users/user.service';

@Module({
  providers: [AppService, ReviewService, MovieService, UserService],
  controllers: [ReviewController]
})
export class ReviewModule {}
