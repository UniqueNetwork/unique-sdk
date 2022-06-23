import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UniqueModule } from '../modules/unique/unique.module';
import { SubstratePrimaryModule } from '../modules/substrate/substrate.primary.module';
import { SubstrateModule } from '../modules/substrate/substrate.module';
import { Config } from '../config/config.module';

export const addSwagger = (app: INestApplication) => {
  const configService: ConfigService<Config> = app.get(ConfigService);
  const { chainWsUrl, name } =
    configService.get<Config['secondary']>('secondary');
  const secondaryDescription =
    chainWsUrl && name
      ? [
          `Instance have secondary substrate connection with prefix ${name}`,
          `please see swagger at <a href="./${name}">${configService.get(
            'swagger',
          )}/${name}</a>`,
        ].join('\n\n')
      : null;

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
        secondaryDescription,
      ].join('\n\n'),
    )
    .setVersion('1.0')
    .build();

  const uniqueDocument = SwaggerModule.createDocument(app, config, {
    include: [UniqueModule, SubstratePrimaryModule],
  });
  SwaggerModule.setup(configService.get('swagger'), app, uniqueDocument);

  if (secondaryDescription) {
    const secondaryDocument = SwaggerModule.createDocument(app, config, {
      include: [SubstrateModule],
    });
    SwaggerModule.setup(
      `${configService.get('swagger')}/${name}`,
      app,
      secondaryDocument,
    );
  }
};
