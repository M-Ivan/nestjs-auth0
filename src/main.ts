import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger(AppModule.name);

  app.use(cookieParser(configService.get('cookie_secret')));
  await app.listen(configService.get('port'));
  logger.log(
    `Service live and listening requests on port ${configService.get('port')}`,
  );
}
bootstrap();
