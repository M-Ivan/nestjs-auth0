import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth0Service } from './auth0.service';
import { UserMapper } from './mappers/user.mapper.service';

@Module({
  providers: [AuthService, Auth0Service, UserMapper],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
