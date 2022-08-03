/* eslint-disable class-methods-use-this */

import { Test } from '@nestjs/testing';
import { INestApplication, LoggerService } from '@nestjs/common';
import { waitReady } from '@polkadot/wasm-crypto';
import { mnemonicValidate } from '@polkadot/util-crypto';
import * as process from 'process';
import { AppModule } from '../src/app/app.module';

class EmptyLogger implements LoggerService {
  log(): any {}

  error(): any {}

  warn(): any {}
}

export async function createApp(): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  await waitReady();

  const app = testingModule.createNestApplication();
  app.setGlobalPrefix('/api');

  if (process.env.TEST_SHOW_LOG !== 'true') {
    app.useLogger(new EmptyLogger());
  }

  app.enableCors();

  await app.init();
  return app;
}

export function expectKeyfile(keyfile) {
  expect(keyfile).toMatchObject({
    encoded: expect.any(String),
    encoding: expect.any(Object),
    address: expect.any(String),
    meta: expect.any(Object),
  });
  expect(keyfile.encoding).toMatchObject({
    content: expect.any(Array),
    type: expect.any(Array),
    version: expect.any(String),
  });
}

export function expectAccount(account) {
  expect(account).toMatchObject({
    mnemonic: expect.any(String),
    seed: expect.any(String),
    publicKey: expect.any(String),
    keyfile: expect.any(Object),
  });
  expect(true).toEqual(mnemonicValidate(account.mnemonic));
  expectKeyfile(account.keyfile);
}
