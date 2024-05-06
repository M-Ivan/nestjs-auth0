import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Auth0ServiceMock, CacheMock } from '../../test/mocks/app.mocks';
import { Auth0Service } from './auth0.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppErrorCodes } from '../common/enum/app.error.codes.enum';
import { AuthSession } from './dto/auth-session.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

describe('AuthController', () => {
  let app: TestingModule;
  let service: AuthService;
  let jwtService: JwtService;

  beforeAll(async () => {
    jest.useFakeTimers();
    app = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CACHE_MANAGER, useValue: CacheMock },
        { provide: Auth0Service, useValue: Auth0ServiceMock },
        JwtService,
        ConfigService,
      ],
    }).compile();

    service = app.get<AuthService>(AuthService);
    jwtService = app.get<JwtService>(JwtService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const fakeJwt = jwtService.sign(
        {
          sub: 'amazing sub',
        },
        {
          secret: 'testing',
        },
      );

      const tokens = Auth0ServiceMock.getUserTokens.mockResolvedValueOnce({
        access_token: 'access_token',
        id_token: fakeJwt,
        expires_in: 3600,
      });

      const fakeSetSession = jest.spyOn(service, 'setSession');

      const result = await service.login('test', 'password');

      expect(Auth0ServiceMock.getUser).toHaveBeenCalledWith('amazing sub');
      expect(fakeSetSession).toHaveBeenCalled();
      expect(result.session_id).toBeDefined();
      expect(Auth0ServiceMock.getUserTokens).toHaveBeenCalledWith(
        'test',
        'password',
      );
    });
  });

  describe('logout', () => {
    it('should logout', async () => {
      await service.logout('test');
      expect(CacheMock.del).toHaveBeenCalledWith('test');
    });
  });

  describe('validateUserSession', () => {
    it('should throw because session id wasnt provided', async () => {
      try {
        await service.validateUserSession({} as Request);
      } catch (e) {
        expect(e).toEqual(
          new HttpException(
            {
              code: AppErrorCodes.USER_NOT_AUTHENTICATED,
              message: 'User is not logged in.',
              statusCode: HttpStatus.UNAUTHORIZED,
            },
            HttpStatus.UNAUTHORIZED,
          ),
        );
      }
    });

    it('should throw because session doesnt exist', async () => {
      try {
        await service.validateUserSession({
          signedCookies: { session_id: '1234' },
        } as unknown as Request);
      } catch (e) {
        expect(e).toEqual(
          new HttpException(
            {
              code: AppErrorCodes.SESSION_NOT_FOUND,
              message: 'Auth session not found.',
              statusCode: HttpStatus.UNAUTHORIZED,
            },
            HttpStatus.UNAUTHORIZED,
          ),
        );
      }
    });

    it('should refresh expired session and return session', async () => {
      const fakeSession = {
        session_id: '1234',
        user_profile: {},
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        exp: 1,
      };

      const fakeSessionCall = jest
        .spyOn(service, 'getSession')
        .mockResolvedValueOnce(fakeSession as AuthSession);

      Auth0ServiceMock.refreshTokens.mockResolvedValueOnce({
        access_token: 'new_access_token',
        refresh_token: 'new_refresh',
        expires_in: 3600,
      });

      const fakeSetSession = jest.spyOn(service, 'setSession');

      const expected = {
        ...fakeSession,
        access_token: 'new_access_token',
        refresh_token: 'new_refresh',
        exp: 3600,
        iss: Date.now() / 1000,
      };

      const result = await service.validateUserSession({
        signedCookies: { session_id: '1234' },
      } as unknown as Request);

      expect(fakeSessionCall).toHaveBeenCalledWith('1234');
      expect(fakeSetSession).toHaveBeenCalled();
      expect(result.access_token).toEqual(expected.access_token);
      expect(result.refresh_token).toEqual(expected.refresh_token);
      expect(result.user_profile).toEqual(expected.user_profile);
    });
  });

  describe('setSession', () => {
    it('should set user session', async () => {
      const session = {
        session_id: '1234',
        user_profile: {},
        access_token: 'access',
      };

      const result = await service.setSession(session as AuthSession);
      expect(result).toBe(session);
    });
  });

  describe('getSession', () => {
    it('should get user session', async () => {
      const session = {
        session_id: '1234',
        user_profile: {},
        access_token: 'access',
      };

      CacheMock.get.mockResolvedValueOnce(JSON.stringify(session));

      const result = await service.getSession(session.session_id);
      expect(result.session_id).toBe(session.session_id);
    });
  });
});
