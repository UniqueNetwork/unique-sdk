import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ErrorCodes } from '@unique-nft/sdk/errors';

import { KeyringPair } from '@polkadot/keyring/types';
import { Sdk } from '@unique-nft/sdk';
import { CreateCollectionArguments, SdkOptions, SdkSigner } from '@unique-nft/sdk/types';
import { createSigner, SignerOptions } from '@unique-nft/sdk/sign';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import { HexString } from '@polkadot/util/types';
import { INamespace } from 'protobufjs';
import { createApp } from './utils.test';
import { TokenController } from '../src/app/controllers';

export const getDefaultSdkOptions = (): SdkOptions => ({
  chainWsUrl: 'wss://ws-quartz-dev.unique.network',
  ipfsGatewayUrl: 'https://ipfs.unique.network/ipfs/',
});

export async function createSdk(signerOptions?: SignerOptions): Promise<Sdk> {
  const defOptions = getDefaultSdkOptions();
  const signer: SdkSigner | undefined = signerOptions
    ? await createSigner(signerOptions)
    : undefined;
  const options: SdkOptions = {
    chainWsUrl: defOptions.chainWsUrl,
    ipfsGatewayUrl: defOptions.ipfsGatewayUrl,
    signer,
  };
  return Sdk.create(options);
}

export type TestAccounts = {
  alice: KeyringPair;
  bob: KeyringPair;
  charlie: KeyringPair;
  dave: KeyringPair;
  eve: KeyringPair;
  ferdie: KeyringPair;
};

export const getKeyringPairs = async (): Promise<TestAccounts> => {
  await cryptoWaitReady();
  const keyring = new Keyring({ type: 'sr25519' });

  return {
    alice: keyring.addFromUri('//Alice'),
    bob: keyring.addFromUri('//Bob'),
    charlie: keyring.addFromUri('//Charlie'),
    dave: keyring.addFromUri('//Dave'),
    eve: keyring.addFromUri('//Eve'),
    ferdie: keyring.addFromUri('//Ferdie'),
  };
};

export const getLastCollectionId = (sdk: Sdk): Promise<number> =>
  sdk.api.rpc.unique
     .collectionStats()
     .then(({ created }) => created.toNumber());

export const getLastTokenId = (
  sdk: Sdk,
  collectionId: number,
): Promise<number> =>
  sdk.api.rpc.unique
     .lastTokenId(collectionId)
     .then((tokenId) => tokenId.toNumber());

export const delay = (ms = 1000) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export function signWithAccount(
  sdk: Sdk,
  account: KeyringPair,
  signerPayloadHex: HexString,
): HexString {
  return sdk.extrinsics.packSignatureType(
    account.sign(signerPayloadHex),
    account.type,
  );
}

const constOnChainSchema: INamespace = {
  nested: {
    onChainMetaData: {
      nested: {
        NFTMeta: {
          fields: {
            ipfsJson: {
              id: 1,
              rule: 'required',
              type: 'string',
            },
            name: {
              id: 2,
              rule: 'required',
              type: 'string',
            },
          },
        },
      },
    },
  },
};

const collectionInitial: Omit<CreateCollectionArguments, 'address'> = {
  name: `foo_${Math.floor(Math.random() * 1000)}`,
  description: 'bar',
  tokenPrefix: 'BAZ',
  schemaVersion: 'Unique',
  variableOnChainSchema: '{}',
};


async function createCollection(
  sdk: Sdk,
  account: KeyringPair,
): Promise<{ collectionId: number }> {
  const txPayload = await sdk.collections.create({
    ...collectionInitial,
    address: account.address,
    constOnChainSchema,
  });

  const signature = signWithAccount(sdk, account, txPayload.signerPayloadHex);

  await sdk.extrinsics.submit({
    signerPayloadJSON: txPayload.signerPayloadJSON,
    signature,
  });

  await delay(30_000);

  const collectionId = await getLastCollectionId(sdk);

  const newCollection = await sdk.collections.get({ collectionId });

  expect(newCollection).toMatchObject(collectionInitial);

  return { collectionId };
}

describe(TokenController.name, () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  describe('GET /api/token', () => {
    it('valid tokenId', async () => {
      const { ok } = await request(app.getHttpServer())
        .get(`/api/token`)
        .query({ collectionId: 1, tokenId: 1 });
      expect(ok).toEqual(true);
    });

    it.each([
      {
        collectionId: 'foo',
        tokenId: 1,
      },
      {
        collectionId: 1,
        tokenId: 'foo',
      },
    ])('invalid collectionId or tokenId - %j', async (obj) => {
      const { ok, body } = await request(app.getHttpServer())
        .get(`/api/token`)
        .query(obj);
      expect(ok).toEqual(false);
      expect(body.error.code).toEqual(ErrorCodes.Validation);
    });

    describe('POST /api/token', () => {
      it('generate token', async () => {
        const testAccounts = await getKeyringPairs();
        const accountFerdie: KeyringPair = testAccounts.ferdie;
        const sdk = await app.get(Sdk);
        const { collectionId }: { collectionId: number } =
          await createCollection(sdk, accountFerdie);
        const { ok } = await request(app.getHttpServer())
          .post(`/api/token`)
          .send({
            collectionId,
            address: accountFerdie.address,
            constData: { ipfsJson: 'aaa', name: 'bbb' },
          });
        expect(ok).toEqual(true);
      }, 120_000);
    });
  });
});
