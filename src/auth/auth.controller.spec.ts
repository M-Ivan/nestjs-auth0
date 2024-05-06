import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceMock, classesMock } from '../../test/mocks/app.mocks';
import { Response } from 'express';
import { UserMapper } from './mappers/user.mapper.service';
import { AuthSession } from './dto/auth-session.dto';

const mockResponse = {
  cookie: jest.fn(),
  clearCookie: jest.fn(),
};

describe('AuthController', () => {
  let app: TestingModule;
  let controller: AuthController;
  let mapper: UserMapper;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: AuthServiceMock },
        UserMapper,
      ],
    }).compile();

    controller = app.get<AuthController>(AuthController);
    mapper = app.get<UserMapper>(UserMapper);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call handler with correct args', async () => {
      AuthServiceMock.login.mockResolvedValueOnce({
        session_id: '1234',
        user_profile: classesMock.user,
      });

      const result = await controller.login(
        { username: 'test', password: 'password' },
        mockResponse as unknown as Response,
      );
      expect(AuthServiceMock.login).toHaveBeenCalledWith('test', 'password');
      expect(result.userId).toEqual(classesMock.user.user_id);
    });
  });

  describe('logout', () => {
    it('should call handler with correct args', async () => {
      AuthServiceMock.logout.mockResolvedValueOnce(true);

      const session = {
        session_id: '1234',
        user_profile: classesMock.user,
      };

      await controller.logout(
        session as unknown as AuthSession,
        mockResponse as unknown as Response,
      );
      expect(AuthServiceMock.logout).toHaveBeenCalledWith(session.session_id);
    });
  });

  describe('me', () => {
    it('should call handler with correct args', async () => {
      const session = {
        session_id: '1234',
        user_profile: classesMock.user,
      } as unknown as AuthSession;

      const user = await controller.me(session);

      expect(user).toEqual(mapper.mapAuth0UserToUserDto(session.user_profile));
    });

    it('should throw error because session is not valid', async () => {
      try {
        await controller.me(null);
      } catch (e) {
        expect(e.message).toEqual('User is not logged in.');
      }
    });
  });
});
