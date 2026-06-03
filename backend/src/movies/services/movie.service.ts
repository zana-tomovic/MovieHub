import { Injectable, UseFilters } from "@nestjs/common";
import { AppService } from "src/app.service";

@Injectable()
export class MovieService {
    constructor(private readonly appService: AppService) {}
    
    async findByKey(key?: string) {
        const cursor = await this.appService.db.query(`for m in movies filter m._key == @key return m`, {key});
        
        return cursor.next();
    }

    async searchByTitle(title?: string) {
        const db = this.appService.db;

        if (!title || title.trim () === '') {
            const cursor = await db.query(`for m in movies return m`);
            return cursor.all();
        }
        
        const cursor = await db.query(`for m in movies filter contains(lower(m.Title), lower(@title)) return m`, {title});
        
        return cursor.all();
    }

    async searchByChoice(filters: {
        decade?: string; 
        rating?: string;
        genre?: string;
    }) {

        let query = `for m in movies`;
        let conditions: string[] = [];
        let bindVars: any = {};

        if (filters.genre) {
            conditions.push(`contains(lower(m.Genre), lower(@genre))`);
            bindVars.genre = filters.genre;
        }

        if (filters.decade) {
            switch(filters.decade) {
                case "New":
                    conditions.push(`m.Release_Date >= "2025-01-01"`);      
                    break;
                case "2020s":
                    conditions.push(`m.Release_Date >= "2020-01-01"`);
                    break;
                case "2010s":
                    conditions.push(`m.Release_Date >= "2010-01-01"`);
                    break;
                case "2000s":
                    conditions.push(`m.Release_Date >= "2000-01-01"`);
                    break;
            }
        }

        if (filters.rating == "Highest") {
            query += ` sort m.Vote_Average desc`;
        } else if (filters.rating == "Lowest") {
            query += ` sort m.Vote_Average asc`;
        }

        if (conditions.length > 0) {
            query += ` filter ${conditions.join(' and ')}`
        }   

        query += ` return m`;

        const cursor = await this.appService.db.query(query, bindVars);
        return cursor.all();
    }

    async updateRating(movieId: string) {
        const query = `
          for m in movies
          filter m._key == "${movieId}"
          let ratings = (
            for v in outbound m._id hasReview
            return v.rating 
          )

          let voteCount = length(ratings)
          let voteAv = voteCount > 0 ? round(average(ratings) * 100) / 100 : 0
          update m with {
            Vote_Average: voteAv,
            Vote_Count: voteCount 
          } in movies
          return NEW
          `;
        
        const cursor = await this.appService.db.query(query);
        return await cursor.all();
    }
}