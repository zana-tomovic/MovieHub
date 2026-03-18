import { Injectable, UnauthorizedException } from "@nestjs/common";

import { AppService } from "src/app.service";
import { User } from "./user";
import { aql } from "arangojs";
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly appService: AppService) {}
        
    async findAllUsers() {
        const cursor = await this.appService.db.query(aql `for u in users return u`);
        return await cursor.all();
    }

    async findByUsername(username: string) {
        const cursor = await this.appService.db.query( `for u in users filter u.username == @username return u`, {username});
        return cursor.next();
    }

    async register(user: User) {
        const hashPass = await bcrypt.hash(user.password, 10);
        
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
        await this.appService.db.query(`for u in users filter u.username == @username remove u in users`, {username});

        return { message: 'Nalog je izbrisan.'};
    }
}