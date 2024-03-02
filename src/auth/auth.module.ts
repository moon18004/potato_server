import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService]
})
export class AuthModule {}
