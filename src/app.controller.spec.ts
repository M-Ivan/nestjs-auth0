import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppServiceMock } from '../test/mocks/app.mocks';

describe('AppController', () => {
  let app: TestingModule;
  let controller: AppController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: AppServiceMock }],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  describe('getVersion', () => {
    it('should return version of app', () => {
      expect(controller.getVersion()).toBe('1.0.0');
    });
  });
});
