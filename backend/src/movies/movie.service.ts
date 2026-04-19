import { Injectable, UseFilters } from "@nestjs/common";
import { AppService } from "src/app.service";

@Injectable()
export class MovieService {
    constructor(private readonly appService: AppService) {}
    
    async searchByName(name?: string) {
        const db = this.appService.db;

        if (!name || name.trim () === '') {
            const cursor = await db.query(`for m in movies return m`);
            return cursor.all();
        }
        
        const cursor = await db.query(`for m in movies filter contains(lower(m.Title), lower(@name)) return m`, {name});
        
        return cursor.all();
    }

    // async searchByDecade(decade: string) {
    //     let query = ""

    //     switch(decade) {
    //         case "Novi":
    //             query = `for m in movies filter m.Release_Date >= "2025-01-01" return m`;
    //             break;
    //         case "2020s":
    //             query = `for m in movies filter m.Release_Date >= "2020-01-01" return m`;
    //             break;
    //         case "2010s":
    //             query = `for m in movies filter m.Release_Date >= "2010-01-01" return m`;
    //             break;
    //         case "2000s":
    //             query = `for m in movies filter m.Release_Date >= "2000-01-01" return m`;
    //             break;
    //     }

    //     const cursor = await this.appService.db.query(query);

    //     return cursor.all();
    // }

    // async searchByRating(rating: string) {
    //     let query = ""; 

    //     if (rating == "Najvisočiji") {
    //         query = `for m in movies sort m.Vote_Average desc return m`
    //     } else if (rating == "Najniži") {
    //         query = `for m in movies sort m.Vote_Average asc return m`
    //     }

    //     const cursor = await this.appService.db.query(query);

    //     return cursor.all();
    // }

    // async searchByGenre(genre: string) {
    //     const cursor = await this.appService.db.query(`for m in movies filter @genre in m.Genre return m`, {genre})
        
    //     return cursor.all();
    // }

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
                case "Novi":
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

        if (filters.rating == "Najvisočiji") {
            query += ` sort m.Vote_Average desc`;
        } else if (filters.rating == "Najniži") {
            query += ` sort m.Vote_Average asc`;
        }

        if (conditions.length > 0) {
            query += ` filter ${conditions.join(' and ')}`
        }   

        query += ` return m`;

        const cursor = await this.appService.db.query(query, bindVars);
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

          let voteCount = length(ratings)
          let voteAv = voteCount > 0 ? average(ratings): 0

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