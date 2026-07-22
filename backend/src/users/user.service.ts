import { Injectable, UnauthorizedException } from "@nestjs/common";

import { AppService } from "src/app.service";
import { User } from "./user";
import { aql } from "arangojs";
import bcrypt from 'bcrypt';
import { ReviewUserService } from "src/reviews/services/review-user.service";

@Injectable()
export class UserService {
    constructor(private readonly appService: AppService,
                private reviewUserService: ReviewUserService
    ) {}
        
    async findAll() {
        const cursor = await this.appService.db.query(aql `for u in users return u`);
        return await cursor.all();
    }

    async findByUsername(username: string) {
        const cursor = await this.appService.db.query( `for u in users filter u.username == @username return u`, {username});
        return cursor.next();
    }

    async register(user: User) {
        const hashPass = await bcrypt.hash(user.password, 10);
        
        if (await this.findByUsername(user.username)) {
            throw new UnauthorizedException("The username is not available.");
        }

        const newUser = {
            username: user.username,
            email: user.email,
            password: hashPass
        }

        const cursor = await this.appService.db.query(aql `insert ${newUser} into users RETURN NEW`);
        
        const res = await cursor.next();
        delete res.password;

        return res;
    }

    async update(user: Partial<User>) {
        const updatedUser: Partial<User> = {};

        if (user.email) {
            updatedUser.email = user.email;
        }

        if (user.password) {
            updatedUser.password = await bcrypt.hash(user.password, 10);            
        }

        if (user.image) {
            updatedUser.image = user.image;
        }

        const cursor = await this.appService.db.query(aql 
            `for u in users
             filter u.username == ${user.username}
             update u with ${updatedUser} in users
             RETURN NEW
            `);
        
        const res = await cursor.next();
        delete res.password;

        return res;
    }

    async delete(username: string) {
        const cursor = await this.appService.db.query(`
                for r in reviews
                filter r.username == @username
                return r._key
            `, {username})

        const res = await cursor.next();

        await this.reviewUserService.delete(res);

        await this.appService.db.query(`for u in users filter u.username == @username remove u in users`, {username});

        return { message: 'Account has been deleted.'};
    }
}