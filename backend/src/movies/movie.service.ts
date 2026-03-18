import { Injectable } from "@nestjs/common";
import { AppService } from "src/app.service";

@Injectable()
export class MovieService {
    constructor(private readonly appService: AppService) {}
    
    async search(name?: string) {
        const db = this.appService.db;

        if (!name || name.trim () === '') {
            const cursor = await db.query(`for m in movies return m`);
            return cursor.all();
        }
        
        const cursor = await db.query(`for m in movies filter contains(lower(m.Title), lower(@name)) return m`, {name});
        
        return cursor.all();
    }

    async findById(id?: string) {
        const cursor = await this.appService.db.query(`for m in movies filter m._key == @id return m`, {id});
        
        return cursor.next();
    }

    async updateMovieRating(movieId: string) {
        const query = `
          for m in movies
          filter m._key == "${movieId}"
          let ratings = (
            for v in outbound m._id hasReview
            return v.rating 
          )

          filter length(ratings) > 0

          update m with {
            Vote_Average: average(ratings),
            Vote_Count: Length(ratings)
          } in movies
          return NEW
          `;
        
        const cursor = await this.appService.db.query(query);
        return await cursor.all();
    }
}