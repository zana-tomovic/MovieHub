import { Injectable } from "@nestjs/common";
import { AppService } from "src/app.service";

@Injectable()
export class MovieRecService {
    constructor(private readonly appService: AppService) {}

    async getRec(key: string) {
        const query = `
          let movie = first(
            for m in movies
            filter m._key == "${key}"
            return m
        )

        let genres = split(movie.Genre, ",")

        for m in movies
        filter m._key != movie._key
        let common = length(intersection(genres, split(m.Genre, ",")))
        filter common > 0
        sort common desc
        limit 10 
        return distinct m
        `

        const cursor = await this.appService.db.query(query);
        return await cursor.all();
    }

    async getPopular() {
        const query = `
            let prev_year = to_string(date_year(date_now()) - 1)
            let current_year = to_string(date_year(date_now()))

            for r in reviews 
            for v in inbound r hasReview
            filter starts_with(v.Release_Date, prev_year) or starts_with(v.Release_Date, current_year)
            sort r.rating desc
            limit 10
            return distinct v
        `

        const cursor = await this.appService.db.query(query);
        return await cursor.all();
    }

    async getNew() {
        const query = `
            let current_year = to_string(date_year(date_now()))

            for m in movies 
            filter starts_with(m.Release_Date, current_year)
            limit 5
            return m
        `

        const cursor = await this.appService.db.query(query);
        return await cursor.all();
    }

    async getRecForUser(username: string) {
        const query = `
            let user = first(
                for u in users
                filter u.username == @username
                return u
            )

            let savedMovies = (
                for s in isSaved
                filter s._from == user._id
                for m in movies
                filter concat("movies/", m._key) == s._to 
                return m
            )

            let seenMovies = (
                for s in isSeen
                filter s._from == user._id
                for m in movies
                filter concat("movies/", m._key) == s._to 
                return m
            ) 

            let highRateMov = (
                for m in movies
                for v in outbound m hasReview
                filter v.username == user.username
                sort v.rating desc    
                return m
            )
            
            let excludedKeys = unique(
                append(
                    (for m in savedMovies return m._key),
                    (for m in seenMovies return m._key)
                )
            )

            for m in movies
            for h in highRateMov
            let common = length(intersection(split(h.Genre, ","), split(m.Genre, ",")))
            filter common > 0
            filter m._key not in excludedKeys
            sort common desc
            limit 10 
            return distinct m
        `

        const cursor = await this.appService.db.query(query, { username });
        return await cursor.all();
    }
}