import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { waitReady } from '@polkadot/wasm-crypto';
import request from 'supertest';

import { BalanceController } from '../src/app/controllers';
import { AppModule } from '../src/app/app.module';

describe(BalanceController.name, () => {
  let app: INestApplication;
  let alice: KeyringPair;
  let bob: KeyringPair;
  let emptyUser: KeyringPair;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await waitReady();

    app = testingModule.createNestApplication();
    app.setGlobalPrefix('/api');
    await app.init();

    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
    bob = new Keyring({ type: 'sr25519' }).addFromUri('//Bob');
    emptyUser = new Keyring({ type: 'sr25519' }).addFromUri('EmptyUser');
  });

  describe('signers', () => {
    it('seed - ok', async () => {
      const buildResponse = await request(app.getHttpServer())
        .post(`/api/balance/transfer`)
        .send({
          address: alice.address,
          destination: bob.address,
          amount: 0.001,
        });
      expect(buildResponse.ok).toEqual(true);
      const { signerPayloadHex, signerPayloadJSON } = buildResponse.body;

      const signResponse = await request(app.getHttpServer())
        .post(`/api/extrinsic/sign`)
        .send({
          signerPayloadHex,
        });
      expect(signResponse.ok).toEqual(true);
      const { signature } = signResponse.body;

      const submitResponse = await request(app.getHttpServer())
        .post(`/api/extrinsic/submit`)
        .send({
          signerPayloadJSON,
          signature,
        });
      expect(submitResponse.ok).toEqual(true);
    });
  });
});
