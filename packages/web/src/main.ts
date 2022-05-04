/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import '@polkadot/api-augment';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { addSwagger } from './app/utils/swagger';
import { Config } from './app/config/config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService<Config> = app.get(ConfigService);

  const prefix = config.get('prefix');
  if (prefix) {
    app.setGlobalPrefix(prefix);
  }

  // todo `npm start --with-swagger`? `npm run build:web:swagger`?
  addSwagger(app);

  const port = config.get('port');
  await app.listen(port);
  Logger.log(
    `Application is running on :${[port, prefix].filter((v) => !!v).join('/')}`,
  );
}

bootstrap();
