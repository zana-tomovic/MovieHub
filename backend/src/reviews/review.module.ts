import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AppService } from 'src/app.service';
import { MovieService } from 'src/movies/movie.service';
import { ReviewController } from './review.controller';

@Module({
  providers: [AppService, ReviewService, MovieService],
  controllers: [ReviewController]
})
export class ReviewModule {}
