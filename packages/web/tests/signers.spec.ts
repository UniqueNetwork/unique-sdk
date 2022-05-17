import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { waitReady } from '@polkadot/wasm-crypto';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { SignType } from '@unique-nft/sdk/sign';
import { ErrorCodes } from '@unique-nft/sdk/errors';
import * as process from 'process';
import request from 'supertest';

import { BalanceController } from '../src/app/controllers';
import { AppModule } from '../src/app/app.module';

const testUser = {
  seed: 'bus ahead nation nice damp recall place dance guide media clap language',
  password: '1234567890',
  keyfile: {
    encoded:
      'W+AsS/awIMmo6dB5lyornWFQ5bUpA1xUN8n8dxu9q2QAgAAAAQAAAAgAAADA6bTLjVK9tTinUDROjJNwL49vgFwn40WV1f7rb0svNFwK3AmNQ+pfW0i7mcFKt9id7KKNm2W3jr0vePTrQmOsfACWSyN55cYs2cqI/VbF/92ZUgo6YTbdwxLHzU1t3l1LdkU5DdaR5ZbPl7SGGYAk5FnjRLQmTWfXHEW1teuYbsdy8lthPoEYa/t57U30YZ21FzD/I7zt0IN9ekkD',
    encoding: {
      content: ['pkcs8', 'sr25519'],
      type: ['scrypt', 'xsalsa20-poly1305'],
      version: '3',
    },
    address: '5HNUuEAYMWEo4cuBW7tuL9mLHR9zSA8H7SdNKsNnYRB9M5TX',
    meta: {
      genesisHash: '',
      name: 'Unique-sdk test user',
      whenCreated: 1652779712656,
    },
  },
};

describe(BalanceController.name, () => {
  let app: INestApplication;
  let alice: KeyringPair;
  let bob: KeyringPair;

  beforeAll(async () => {
    await cryptoWaitReady();

    alice = new Keyring({ type: SignType.sr25519 }).addFromUri('//Alice');
    bob = new Keyring({ type: SignType.sr25519 }).addFromUri('//Bob');
  });

  async function createApp() {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await waitReady();

    app = testingModule.createNestApplication();
    app.setGlobalPrefix('/api');
    await app.init();
  }

  async function signAndVerify(
    from: string,
    to: string,
  ): Promise<request.Test> {
    const buildResponse = await request(app.getHttpServer())
      .post(`/api/balance/transfer`)
      .send({
        address: from,
        destination: to,
        amount: 0.001,
      });
    expect(true).toEqual(buildResponse.ok);
    const { signerPayloadJSON, signerPayloadHex } = buildResponse.body;

    const signResponse = await request(app.getHttpServer())
      .post(`/api/extrinsic/sign`)
      .send({
        signerPayloadHex,
      });
    expect(true).toEqual(signResponse.ok);
    const { signature } = signResponse.body;

    return request(app.getHttpServer())
      .post(`/api/extrinsic/verify-sign`)
      .send({
        signature,
        signerPayloadJSON,
      });
  }

  describe('signer env/uri', () => {
    beforeAll(async () => {
      process.env.SIGNER_URI = '//Alice';
      await createApp();
    });

    it('sign - ok', async () => {
      const { ok } = await signAndVerify(alice.address, bob.address);
      expect(true).toEqual(ok);
    });
    it('sign - fail', async () => {
      const { ok, body } = await signAndVerify(bob.address, alice.address);
      expect(false).toEqual(ok);
      expect(ErrorCodes.BadSignature).toEqual(body.error.code);
    });
  });

  describe('signer env/seed', () => {
    beforeAll(async () => {
      process.env.SIGNER_SEED = testUser.seed;
      await createApp();
    });

    it('sign - ok', async () => {
      const { ok } = await signAndVerify(testUser.keyfile.address, bob.address);
      expect(true).toEqual(ok);
    });
    it('sign - fail', async () => {
      const { ok, body } = await signAndVerify(alice.address, bob.address);
      expect(false).toEqual(ok);
      expect(ErrorCodes.BadSignature).toEqual(body.error.code);
    });
  });
});
