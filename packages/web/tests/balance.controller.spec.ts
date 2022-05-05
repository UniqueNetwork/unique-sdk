import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { waitReady } from '@polkadot/wasm-crypto';
import request from 'supertest';
import { u8aToHex } from '@polkadot/util';
import { ErrorCodes } from '@unique-nft/sdk';

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

  function getBalance(address: string) {
    return request(app.getHttpServer()).get(`/api/balance`).query({ address });
  }
  function transferBuild(amount: number, keyringPair?: KeyringPair): any {
    return request(app.getHttpServer())
      .post(`/api/balance/transfer/build`)
      .send({
        address: keyringPair ? keyringPair.address : alice.address,
        destination: bob.address,
        amount,
      });
  }
  async function transfer(amount: number, keyringPair?: KeyringPair) {
    const keyring = keyringPair || alice;
    const buildResponse = await transferBuild(amount, keyring);
    expect(buildResponse.ok).toEqual(true);
    expect(buildResponse.body).toMatchObject({
      signerPayloadJSON: expect.any(Object),
      signerPayloadHex: expect.any(String),
    });

    const { signerPayloadJSON, signerPayloadHex } = buildResponse.body;
    const signatureU8a = keyring.sign(signerPayloadHex, {
      withType: true,
    });
    const signature = u8aToHex(signatureU8a);

    return request(app.getHttpServer())
      .post(`/api/balance/transfer/submit`)
      .send({
        signature,
        signerPayloadJSON,
      });
  }

  describe('GET /api/balance', () => {
    it('ok', async () => {
      const response = await getBalance(alice.address);

      expect(response.ok).toEqual(true);

      expect(response.body).toMatchObject({
        amount: expect.any(String),
        formatted: expect.any(String),
      });
    });

    it('not ok', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/balance`)
        .query({ address: 'foo' });

      expect(response.ok).toEqual(false);
    });
  });

  describe('GET /api/balance/transfer', () => {
    it('ok', async () => {
      const submitResponse = await transfer(0.001);
      expect(submitResponse.ok).toEqual(true);
      expect(submitResponse.body).toMatchObject({
        hash: expect.any(String),
      });
    });
    it('balance too low', async () => {
      const balanceResponse = await getBalance(emptyUser.address);
      const currentAmount = +balanceResponse.body.amount;
      const submitResponse = await transfer(currentAmount + 1, emptyUser);
      expect(submitResponse.ok).toEqual(false);
      expect(submitResponse.body.error.code).toEqual(
        ErrorCodes.SubmitExtrinsic,
      );
    });
    it.each([-1])('invalid amount: %d', async (amount) => {
      // todo: add err case, value=0
      const buildResponse = await transferBuild(amount);
      expect(buildResponse.ok).toEqual(false);
      expect(buildResponse.body.error.code).toEqual(ErrorCodes.BuildExtrinsic);
    });
    // todo: add error case, transfer to myself
  });
});
