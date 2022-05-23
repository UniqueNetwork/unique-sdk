import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { waitReady } from '@polkadot/wasm-crypto';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { ErrorCodes } from '@unique-nft/sdk/errors';
import { SignatureType } from '@unique-nft/sdk/types';
import * as process from 'process';

import request from 'supertest';
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

describe('Web signers', () => {
  let app: INestApplication;
  let alice: KeyringPair;
  let bob: KeyringPair;

  beforeAll(async () => {
    await cryptoWaitReady();

    alice = new Keyring({ type: SignatureType.Sr25519 }).addFromUri('//Alice');
    bob = new Keyring({ type: SignatureType.Sr25519 }).addFromUri('//Bob');
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

  function getAddressByName(name: string): string {
    switch (name) {
      case 'alice':
        return alice.address;
      case 'bob':
        return bob.address;
      case 'testUser':
        return testUser.keyfile.address;
      default:
        return null;
    }
  }

  async function signAndVerify(
    from: string,
    to: string,
    headers: object = {},
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
      .set(headers)
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
      process.env.SIGNER_SEED = '//Alice';
      await createApp();
    });

    it('sign - ok', async () => {
      const { ok, body } = await signAndVerify(alice.address, bob.address);
      expect(true).toEqual(ok);
      expect(true).toEqual(body.isValid);
    });
    it('sign - fail', async () => {
      const { ok, body } = await signAndVerify(bob.address, alice.address);
      expect(true).toEqual(ok);
      expect(false).toEqual(body.isValid);
    });
  });

  describe('signer env/seed', () => {
    beforeAll(async () => {
      process.env.SIGNER_SEED = testUser.seed;
      await createApp();
    });

    it('sign - ok', async () => {
      const { ok, body } = await signAndVerify(
        testUser.keyfile.address,
        bob.address,
      );
      expect(true).toEqual(ok);
      expect(true).toEqual(body.isValid);
    });
    it('sign - fail', async () => {
      const { ok, body } = await signAndVerify(alice.address, bob.address);
      expect(true).toEqual(ok);
      expect(false).toEqual(body.isValid);
    });
  });

  describe('signer header', () => {
    beforeAll(async () => {
      await createApp();
    });

    it.each(['Seed Alice', '//Alice', testUser.seed])(
      'invalid token - %s',
      async (headValue) => {
        const { ok, body } = await request(app.getHttpServer())
          .post(`/api/extrinsic/sign`)
          .set({
            Authorization: headValue,
          })
          .send();
        expect(false).toEqual(ok);
        expect(ErrorCodes.Validation).toEqual(body.error.code);
      },
    );

    it.each([
      ['Seed //Bob', 'alice'],
      [`Seed ${testUser.seed}`, 'alice'],
    ])('sign fail - %s', async (Authorization, addressName) => {
      const { ok, body } = await signAndVerify(
        getAddressByName(addressName),
        bob.address,
        {
          Authorization,
        },
      );
      expect(true).toEqual(ok);
      expect(false).toEqual(body.isValid);
    });

    it.each([
      ['Seed //Alice', 'alice'],
      [`Seed ${testUser.seed}`, 'testUser'],
    ])('sign ok - %s', async (Authorization, addressName) => {
      const { ok, body } = await signAndVerify(
        getAddressByName(addressName),
        bob.address,
        {
          Authorization,
        },
      );
      expect(true).toEqual(ok);
      expect(true).toEqual(body.isValid);
    });
  });
});
