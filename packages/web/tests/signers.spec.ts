import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { ErrorCodes } from '@unique-nft/sdk/errors';
import { SignatureType } from '@unique-nft/sdk/types';
import * as process from 'process';

import request from 'supertest';
import { createApp } from './utils.test';

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
  let alice: KeyringPair;
  let bob: KeyringPair;

  beforeAll(async () => {
    await cryptoWaitReady();

    alice = new Keyring({ type: SignatureType.Sr25519 }).addFromUri('//Alice');
    bob = new Keyring({ type: SignatureType.Sr25519 }).addFromUri('//Bob');
  });

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

  async function transferAndSign(
    app: INestApplication,
    from: string,
    to: string,
    headers: object = {},
  ): Promise<{ signature: string; signerPayloadJSON: object }> {
    const buildResponse = await request(app.getHttpServer())
      .post(`/api/balance/transfer`)
      .send({
        address: from,
        destination: to,
        amount: 0.000001,
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

    return { signature, signerPayloadJSON };
  }

  async function signAndVerify(
    app: INestApplication,
    from: string,
    to: string,
    headers: object = {},
  ): Promise<request.Test> {
    const { signature, signerPayloadJSON } = await transferAndSign(
      app,
      from,
      to,
      headers,
    );

    return request(app.getHttpServer())
      .post(`/api/extrinsic/verify-sign`)
      .send({
        signature,
        signerPayloadJSON,
      });
  }

  async function signAndSubmit(
    app: INestApplication,
    from: string,
    to: string,
    headers: object = {},
  ): Promise<request.Test> {
    const { signature, signerPayloadJSON } = await transferAndSign(
      app,
      from,
      to,
      headers,
    );

    return request(app.getHttpServer()).post(`/api/extrinsic/submit`).send({
      signature,
      signerPayloadJSON,
      signatureType: SignatureType.Sr25519,
    });
  }

  describe('sign and submit', () => {
    let app: INestApplication;
    beforeAll(async () => {
      app = await createApp();
    });

    it('submit ok', async () => {
      const { ok, body } = await signAndSubmit(
        app,
        alice.address,
        bob.address,
        {
          Authorization: 'Seed //Alice',
        },
      );
      expect(true).toEqual(ok);
      expect(body).toMatchObject({
        hash: expect.any(String),
      });
    });
  });

  describe('signer env/uri', () => {
    let app: INestApplication;
    beforeAll(async () => {
      process.env.SIGNER_SEED = '//Alice';
      app = await createApp();
    });

    it('sign - ok', async () => {
      const { ok, body } = await signAndVerify(app, alice.address, bob.address);
      expect(true).toEqual(ok);
      expect(true).toEqual(body.isValid);
    });
    it('sign - fail', async () => {
      const { ok, body } = await signAndVerify(app, bob.address, alice.address);
      expect(true).toEqual(ok);
      expect(false).toEqual(body.isValid);
    });
  });

  describe('signer env/seed', () => {
    let app: INestApplication;
    beforeAll(async () => {
      process.env.SIGNER_SEED = testUser.seed;
      app = await createApp();
    });

    it('sign - ok', async () => {
      const { ok, body } = await signAndVerify(
        app,
        testUser.keyfile.address,
        bob.address,
      );
      expect(true).toEqual(ok);
      expect(true).toEqual(body.isValid);
    });
    it('sign - fail', async () => {
      const { ok, body } = await signAndVerify(app, alice.address, bob.address);
      expect(true).toEqual(ok);
      expect(false).toEqual(body.isValid);
    });
  });

  describe('signer header', () => {
    let app: INestApplication;
    beforeAll(async () => {
      app = await createApp();
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
        expect(body.error.code).toEqual(ErrorCodes.Validation);
        expect(body.error.message).toEqual('Invalid authorization header');
      },
    );

    it.each([
      ['Seed //Bob', 'alice'],
      [`Seed ${testUser.seed}`, 'alice'],
    ])('sign fail - %s', async (Authorization, addressName) => {
      const { ok, body } = await signAndVerify(
        app,
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
        app,
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
