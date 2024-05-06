import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let app: TestingModule;
  let service: AppService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getVersion', () => {
    it('should return version of app', () => {
      expect(service.getVersion()).toBe('1.0.0');
    });
  });
});
