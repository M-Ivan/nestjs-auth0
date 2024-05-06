import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input.dto';
import { Response } from 'express';
import { ReqUser } from './decorators/req-user.decorator';
import { AuthSession } from './dto/auth-session.dto';
import { UserMapper } from './mappers/user.mapper.service';
import { Authenticate } from './decorators/auth.decorator';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userMapper: UserMapper,
  ) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(
    @Body() loginInput: LoginInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    const session = await this.authService.login(
      loginInput.username,
      loginInput.password,
    );

    res.cookie(
      'session_id',
      session.session_id,
      this.authService.loginCookieOptions,
    );

    return this.userMapper.mapAuth0UserToUserDto(session.user_profile);
  }

  @Authenticate()
  @Get('logout')
  async logout(
    @ReqUser() user: AuthSession,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.session_id);

    res.clearCookie('session_id');
    return { message: 'User logged out.' };
  }

  @Authenticate()
  @Get('me')
  async me(@ReqUser() user: AuthSession) {
    if (!user) {
      throw new HttpException(
        {
          code: HttpStatus.UNAUTHORIZED, // You can use a custom error code here for error handling on client side.
          message: 'User is not logged in.',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.userMapper.mapAuth0UserToUserDto(user.user_profile);
  }
}
