import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UniqueModule } from '../modules/unique/unique.module';
import { SubstratePrimaryModule } from '../modules/substrate/substrate.primary.module';
import { SubstrateModule } from '../modules/substrate/substrate.module';
import { Config } from '../config/config.module';
import { IpfsModule } from '../modules/ipfs/module';

const getAppsLink = (wsUrl: string): string =>
  `(<a target="_blank" href="https://polkadot.js.org/apps/?rpc=${wsUrl}">apps ↗</a>)`;

function createDescription(
  swagger,
  chainWsUrl,
  secondaryChainWsUrl,
  name,
  isSecondary,
) {
  let mainDescription = `Main connection to ${chainWsUrl} ${getAppsLink(
    chainWsUrl,
  )}`;
  let secondaryDescription = '';

  if (secondaryChainWsUrl && name) {
    secondaryDescription = `Secondary substrate connection to ${secondaryChainWsUrl}  ${getAppsLink(
      secondaryChainWsUrl,
    )}`;

    if (isSecondary) {
      secondaryDescription = `<b>${secondaryDescription}</b>`;
      mainDescription = `${mainDescription}. Go to <a href="/${swagger}">swagger</a>`;
    } else {
      mainDescription = `<b>${mainDescription}</b>`;
      secondaryDescription = `${secondaryDescription}. Go to <a href="/${swagger}/${name}">swagger/${name}</a>`;
    }
  }
  return ['Unique SDK HTTP API', mainDescription, secondaryDescription]
    .filter((el) => el)
    .join('\n\n');
}

export const addSwagger = (app: INestApplication) => {
  const configService: ConfigService<Config> = app.get(ConfigService);
  const chainWsUrl = configService.get('chainWsUrl');
  const swagger = configService.get('swagger');
  const { chainWsUrl: secondaryChainWsUrl, name } =
    configService.get<Config['secondary']>('secondary');

  function createDocumentBuilder(description) {
    return new DocumentBuilder()
      .addSecurity('SeedAuth', {
        description: 'Example: "Seed phrase1 phrase2 phrase3 ..."',
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      })
      .setTitle('Unique SDK')
      .setDescription(description)
      .setVersion('1.0')
      .build();
  }

  const config = createDocumentBuilder(
    createDescription(swagger, chainWsUrl, secondaryChainWsUrl, name, false),
  );

  const uniqueDocument = SwaggerModule.createDocument(app, config, {
    include: [UniqueModule, SubstratePrimaryModule, IpfsModule],
  });
  SwaggerModule.setup(configService.get('swagger'), app, uniqueDocument);

  if (secondaryChainWsUrl && name) {
    const secondaryConfig = createDocumentBuilder(
      createDescription(swagger, chainWsUrl, secondaryChainWsUrl, name, true),
    );

    const secondaryDocument = SwaggerModule.createDocument(
      app,
      secondaryConfig,
      {
        include: [SubstrateModule],
      },
    );
    SwaggerModule.setup(
      `${configService.get('swagger')}/${name}`,
      app,
      secondaryDocument,
    );
  }
};
