import { u8aToHex } from '@polkadot/util';
import { INamespace } from 'protobufjs';
import { KeyringPair } from '@polkadot/keyring/types';
import { CreateCollectionArguments } from '@unique-nft/sdk/types';
import { normalizeAddress } from '@unique-nft/sdk/utils';
import { Sdk } from '../src/lib/sdk';
import {
  delay,
  getDefaultSdkOptions,
  getKeyringPairs,
  getLastCollectionId,
  TestAccounts,
} from './testing-utils';

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

const constData = { ipfsJson: 'aaa', name: 'bbb' };

const collectionInitial: Omit<CreateCollectionArguments, 'address'> = {
  name: `foo_${Math.floor(Math.random() * 1000)}`,
  description: 'bar',
  tokenPrefix: 'BAZ',
  schemaVersion: 'Unique',
};

describe(Sdk.name, () => {
  let sdk: Sdk;
  let testAccounts: TestAccounts;
  let account: KeyringPair;

  beforeAll(async () => {
    sdk = await Sdk.create(getDefaultSdkOptions());
    testAccounts = await getKeyringPairs();
    account = testAccounts.ferdie;
  });

  const createCollection = async (): Promise<{ collectionId: number }> => {
    const txPayload = await sdk.collection.create({
      ...collectionInitial,
      address: account.address,
      constOnChainSchema,
    });

    const signature = u8aToHex(account.sign(txPayload.signerPayloadHex));

    await sdk.extrinsics.submit({
      signerPayloadJSON: txPayload.signerPayloadJSON,
      signature,
      signatureType: account.type,
    });

    await delay(30_000);

    const collectionId = await getLastCollectionId(sdk);

    const newCollection = await sdk.collection.get({ collectionId });

    expect(newCollection).toMatchObject(collectionInitial);

    return { collectionId };
  };

  const createToken = async ({
    collectionId,
  }: {
    collectionId: number;
  }): Promise<void> => {
    const txPayload = await sdk.token.create({
      address: account.address,
      collectionId,
      constData,
    });

    const signature = u8aToHex(account.sign(txPayload.signerPayloadHex));

    await sdk.extrinsics.submit({
      signerPayloadJSON: txPayload.signerPayloadJSON,
      signature,
      signatureType: account.type,
    });

    await delay(30_000);

    const newToken = await sdk.token.get({ collectionId, tokenId: 1 });

    expect(newToken).toMatchObject({
      owner: normalizeAddress(account.address, sdk.api.registry.chainSS58),
      constData,
    });
  };

  it('create collection and token', async () => {
    await createCollection().then(createToken);
  }, 90_000);

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
