import { Module } from "@nestjs/common";
import { AppModule } from "src/app.module";
import { UserController } from "src/users/user.controller";
import { UserService } from "src/users/user.service";

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}