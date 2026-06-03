import { Injectable } from "@nestjs/common";
import { AppService } from "src/app.service";

@Injectable()
export class MovieUserService {
    constructor(private readonly appService: AppService) {}

    async getAll(username: string) {
        const query = `
            let user = first(
                for u in users
                filter u.username == @username
                return u
            )

            let saved = (
                for s in isSaved
                filter s._from == user._id
                for m in movies 
                filter concat("movies/", m._key) == s._to 
                return m
            )

            let seen = ( 
                for s in isSeen
                filter s._from == user._id
                for m in movies
                filter concat("movies/", m._key) == s._to 
                return m 
            )

            let userMovies = UNION_DISTINCT(saved, seen)

            for u in userMovies
            return u
        `

        const cursor = await this.appService.db.query(query, {username})
        return cursor.all();
    }

    async getSaved(username: string) {
        const query = `
            let user = first(
                for u in users
                filter u.username == @username
                return u
            )

            for s in isSaved
            filter s._from == user._id
            for m in movies
            filter concat("movies/", m._key) == s._to 
            return m 
        `

        const cursor = await this.appService.db.query(query, {username});

        return cursor.all();
    }

    async saveMovie(key: string, username: string) {
        const query = `
            let user = first(
                for u in users
                filter u.username == @username
                return u
            )

            let movie = first(
                for m in movies
                filter m._key == @key
                return m
            )

            filter user != null && movie != null

            insert {
                _from: user._id,
                _to: movie._id
            } into isSaved
        `;

        await this.appService.db.query(query, {key, username});
    }

    async removeSaved(key: string, username: string) {
        const query = `
            let user = first(
                for u in users
                filter u.username == @username
                return u 
            )

            let movie = first(
                for m in movies
                filter m._key == @key
                return m
            )
            
            let saved = first(
                for saved in isSaved
                filter saved._from == user._id
                filter saved._to == movie._id
                return saved
            )

            remove saved IN isSaved
        `;

        await this.appService.db.query(query, {key, username});
    }

    async getSeen(username: string) {
        const query = `
            let user = first(
                for u in users
                filter u.username == @username
                return u
            )

            for s in isSeen
            filter s._from == user._id
            for m in movies
            filter concat("movies/", m._key) == s._to 
            return m 
        `;

        const cursor = await this.appService.db.query(query, {username});

        return cursor.all();
    }

    async setMovieToSeen(key: string, username: string) {
        const query = `
            let user = first(
                for u in users
                filter u.username == @username
                return u
            )

            let movie = first(
                for m in movies
                filter m._key == @key
                return m
            )

            filter user != null && movie != null

            insert {
                _from: user._id,
                _to: movie._id
            } into isSeen
        `;

        await this.appService.db.query(query, {key, username});
    }

    async removeSeen(key: string, username: string) {
        const query = `
            let user = first(
                for u in users
                filter u.username == @username
                return u 
            )

            let movie = first(
                for m in movies
                filter m._key == @key
                return m
            )
            
           let seen = first(
                for seen in isSeen
                filter seen._from == user._id
                filter seen._to == movie._id
                return seen
            )
                
            remove seen in isSeen
        `;

        await this.appService.db.query(query, {key, username});
    }
}