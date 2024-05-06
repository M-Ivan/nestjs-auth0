import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AuthSession } from './dto/auth-session.dto';
import { Auth0Service } from './auth0.service';
import { v4 as uuid } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly redis: Cache,
    private readonly auth0Service: Auth0Service,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public loginCookieOptions = {
    domain: this.configService.get('api_domain'),
    path: '/',
    secure: false,
    signed: true,
    httpOnly: true,
    maxAge: this.configService.get('login_expires_seconds') * 1000,
  };

  async login(username: string, password: string): Promise<AuthSession> {
    const tokens = await this.auth0Service.getUserTokens(username, password);

    const userInfo = await this.jwtService.decode(tokens.id_token);
    const userProfile = await this.auth0Service.getUser(userInfo.sub);
    const nowInSeconds = Date.now() / 1000;

    return this.setSession({
      session_id: uuid(),
      user_profile: userProfile,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      exp: tokens.expires_in + nowInSeconds,
      iss: nowInSeconds,
    });
  }
  async logout(sessionId: string): Promise<void> {
    await this.redis.del(sessionId);
  }

  async validateUserSession(request: Request): Promise<AuthSession> {
    const sessionId = this.getSessionId(request);

    if (!sessionId) {
      throw new HttpException(
        {
          code: HttpStatus.UNAUTHORIZED, // You can use a custom error code here for error handling on client side.
          message: 'User is not logged in.',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const session = await this.getSession(sessionId);

    if (!session) {
      throw new HttpException(
        {
          code: HttpStatus.UNAUTHORIZED, // You can use a custom error code here for error handling on client side.
          message: 'Auth session not found.',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const nowInSeconds = Date.now() / 1000;

    if (session.exp < nowInSeconds) {
      // Token has expired, refresh it
      const newTokens = await this.auth0Service.refreshTokens(
        session.refresh_token,
      );

      return await this.setSession({
        ...session,
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        exp: newTokens.expires_in + nowInSeconds,
        iss: nowInSeconds,
      });
    }

    return session;
  }

  async setSession(authSession: AuthSession): Promise<AuthSession> {
    const ttl = this.loginCookieOptions.maxAge;

    await this.redis.set(
      authSession.session_id,
      JSON.stringify(authSession),
      ttl,
    );

    return authSession;
  }

  async getSession(sessionId: string): Promise<AuthSession> {
    const session = await this.redis.get(sessionId);

    if (!session) {
      return null;
    }

    return JSON.parse(session as string);
  }

  private getSessionId(request: Request): string {
    if (
      !request ||
      !request.signedCookies ||
      !request.signedCookies['session_id']
    )
      return null;

    return request.signedCookies['session_id'];
  }
}
