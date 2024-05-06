import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  logger: Logger;

  constructor(private readonly authService: AuthService) {
    this.logger = new Logger(AuthenticationGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const response: Response = context.switchToHttp().getResponse();

      const session = await this.authService.validateUserSession(request);

      request.user = session;

      response.cookie(
        'session_id',
        session.session_id,
        this.authService.loginCookieOptions,
      );
    } catch (e) {
      throw e;
    }

    return true;
  }
}
