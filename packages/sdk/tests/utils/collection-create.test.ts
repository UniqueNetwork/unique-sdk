import { INamespace } from 'protobufjs';
import { KeyringPair } from '@polkadot/keyring/types';
import {
  CollectionInfo,
  CreateCollectionArguments,
} from '@unique-nft/sdk/types';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import {
  delay,
  getLastCollectionId,
  signWithAccount,
} from '@unique-nft/sdk/tests/testing-utils';
import { Sdk } from '@unique-nft/sdk';

export const constOnChainSchema: INamespace = {
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

export type TestCollectionInitial = Omit<CreateCollectionArguments, 'address'>;
const defaultCollectionInitial: TestCollectionInitial = {
  name: `foo_${Math.floor(Math.random() * 1000)}`,
  description: 'bar',
  tokenPrefix: 'BAZ',
  properties: {
    schemaVersion: 'Unique',
    constOnChainSchema,
  },
};

async function findCollection(
  sdk: Sdk,
  name: string,
  tryCount = 0,
): Promise<CollectionInfo | null> {
  const collectionId = await getLastCollectionId(sdk);
  const collection = collectionId
    ? await sdk.collection.get({ collectionId })
    : null;
  if (collection && collection.name === name) return collection;
  if (tryCount < 10) {
    await delay(3_000);
    return findCollection(sdk, name, tryCount + 1);
  }
  return null;
}

export async function createCollection(
  sdk: Sdk,
  account: KeyringPair,
  collectionInitial?: TestCollectionInitial,
): Promise<CollectionInfo> {
  const collectionData = collectionInitial || defaultCollectionInitial;
  const txPayload = await sdk.collection.create({
    ...collectionData,
    address: account.address,
  });

  const signature = signWithAccount(sdk, account, txPayload.signerPayloadHex);

  await sdk.extrinsics.submit({
    signerPayloadJSON: txPayload.signerPayloadJSON,
    signature,
  });

  const newCollection = await findCollection(sdk, collectionData.name);
  expect(newCollection).toMatchObject(collectionData);

  if (!newCollection) {
    throw new Error('Create collection fail');
  }
  return newCollection;
}
