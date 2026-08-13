import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/users/services/user.service";
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async login(username: string, pass: string): Promise<{ accessToken: string }> {
        const user = await this.userService.findByUsername(username);

        if (!user) {
            throw new UnauthorizedException("Nevalidan unos.");
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            throw new UnauthorizedException("Nevalidan unos.")
        }
        
        const payload = { _id: user._id, username: user.username };

        return {
            accessToken: await this.jwtService.signAsync(payload),
        }
    }
}