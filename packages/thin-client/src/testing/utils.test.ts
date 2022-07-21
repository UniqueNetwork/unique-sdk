import { NestFactory } from '@nestjs/core';
import { AppModule } from '@unique-nft/web/src/app/app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from '@unique-nft/web/src/app/config/config.module';
import { INestApplication } from '@nestjs/common';

export async function createWeb(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config: ConfigService<Config> = app.get(ConfigService);
  const prefix = config.get('prefix');

  if (prefix) {
    app.setGlobalPrefix(prefix);
  }

  const port = +process.env.TEST_PORT || 3001;
  await app.listen(port);

  return app;
}
