import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const addSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .addSecurity('SeedAuth', {
      description: 'Example: "Seed phrase1 phrase2 phrase3 ..."',
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    })
    .setTitle('Unique SDK')
    .setDescription(
      [
        `Unique SDK HTTP API`,
        `connected to ${configService.get('chainWsUrl')}`,
      ].join('\n\n'),
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(configService.get('swagger'), app, document);
};
