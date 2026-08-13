import { Module } from "@nestjs/common";
import { UserModule } from "src/users/user.module";
import { AuthService } from "src/auth/auth.service";
import { AuthController } from "src/auth/auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "src/configs/jwt-secret";

@Module({
    imports: [
        UserModule, 
        JwtModule.register({
            global: true,
            secret: jwtSecret,
            signOptions: { expiresIn: '12h'}
        })
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}