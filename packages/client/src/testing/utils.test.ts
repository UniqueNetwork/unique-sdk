/* eslint-disable @typescript-eslint/dot-notation */
import { NestFactory } from '@nestjs/core';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { AppModule } from '@unique-nft/web/src/app/app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from '@unique-nft/web/src/app/config/config.module';
import { INestApplication } from '@nestjs/common';
import process from 'process';
import { KeyringProvider } from '@unique-nft/accounts/keyring';
import { SignatureType } from '@unique-nft/accounts';
import { Options } from '../types';
import { Client } from '../index';

const TEST_RICH_ACCOUNTS =
  process.env['TEST_RICH_ACCOUNTS'] || '//Bob,//Charlie,//Eve,//Dave,//Ferdie';
const TEST_POOR_ACCOUNT = process.env['TEST_POOR_ACCOUNT'] || '//Alice';
const TEST_WEB_APP_URL =
  process.env.TEST_WEB_APP_URL || 'http://localhost:3001';

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

const getRichSeed = (): string => {
  const richSeeds = TEST_RICH_ACCOUNTS.split(',');
  const jestWorkerId = Number(process.env['JEST_WORKER_ID'] || '1') - 1;

  return richSeeds[jestWorkerId];
};

async function createSigner() {
  const keyringProvider = new KeyringProvider({
    type: SignatureType.Sr25519,
  });

  await keyringProvider.init();

  return keyringProvider.addSeed(getRichSeed()).getSigner();
}

export async function createClient(withSign: boolean): Promise<Client> {
  const options: Options = {
    baseUrl: TEST_WEB_APP_URL,
    signer: withSign ? await createSigner() : undefined,
  };

  return new Client(options);
}

export type TestAccount = {
  keyringPair: KeyringPair;
  seed: string;
  address: string;
};

function createAccount(seed: string): TestAccount {
  const keyring = new Keyring({ type: 'sr25519' });
  const keyringPair = keyring.addFromMnemonic(seed);
  return {
    keyringPair,
    seed,
    address: keyringPair.address,
  };
}
export const createRichAccount = () => createAccount(getRichSeed());
export const createPoorAccount = () => createAccount(TEST_POOR_ACCOUNT);
