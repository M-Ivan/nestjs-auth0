import { Test, TestingModule } from '@nestjs/testing';
import { Auth0Service } from './auth0.service';
import { ConfigService } from '@nestjs/config';
import {
  Auth0AuthenticationApiMock,
  Auth0ManagementApiMock,
  Auth0TokenSetMock,
  classesMock,
} from '../../test/mocks/app.mocks';
import { HttpException, HttpStatus } from '@nestjs/common';
jest.mock('auth0', () => {
  return {
    AuthenticationClient: jest
      .fn()
      .mockImplementation(() => Auth0AuthenticationApiMock),
    ManagementClient: jest
      .fn()
      .mockImplementation(() => Auth0ManagementApiMock),
  };
});

describe('Auth0Service', () => {
  let app: TestingModule;
  let service: Auth0Service;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            set: jest.fn(),
            get: jest.fn().mockReturnValue('test'),
          } as unknown as ConfigService,
        },
        Auth0Service,
      ],
    }).compile();

    service = app.get<Auth0Service>(Auth0Service);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserTokens', () => {
    it('should return a token set', async () => {
      Auth0AuthenticationApiMock.oauth.passwordGrant.mockResolvedValueOnce({
        data: Auth0TokenSetMock,
      });

      const result = await service.getUserTokens('test', 'password');
      expect(result.access_token).toBeDefined();
      expect(result.id_token).toBeDefined();
      expect(result.expires_in).toBe(3600);
    });

    it('should throw because invalid credentials were provided', async () => {
      try {
        Auth0AuthenticationApiMock.oauth.passwordGrant.mockRejectedValueOnce({
          statusCode: 403,
        });

        await service.getUserTokens('test', 'invalid');
      } catch (e) {
        expect(e).toEqual(
          new HttpException(
            {
              code: HttpStatus.FORBIDDEN,
              message: 'Invalid credentials',
              statusCode: HttpStatus.FORBIDDEN,
            },
            HttpStatus.FORBIDDEN,
          ),
        );
      }
    });
  });

  describe('refreshTokens', () => {
    it('should return a token set', async () => {
      Auth0AuthenticationApiMock.oauth.refreshTokenGrant.mockResolvedValueOnce({
        data: Auth0TokenSetMock,
      });

      const result = await service.refreshTokens('test');
      expect(result.access_token).toBeDefined();
      expect(result.id_token).toBeDefined();
      expect(result.expires_in).toBe(3600);
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      Auth0ManagementApiMock.users.get.mockResolvedValueOnce({
        data: classesMock.user,
      });

      const result = await service.getUser('test');
      expect(result).toEqual(classesMock.user);
    });
  });
});
