import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = 3001;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  Logger.log('App is listening on port: ' + port);
}
bootstrap();
