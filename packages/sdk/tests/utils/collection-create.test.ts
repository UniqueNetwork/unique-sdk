import { INamespace } from 'protobufjs';
import { KeyringPair } from '@polkadot/keyring/types';
import {
  CollectionInfo,
  CreateCollectionArguments,
} from '@unique-nft/sdk/types';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import { Sdk } from '@unique-nft/sdk';
import { signWithAccount } from '../testing-utils';

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

export async function createCollection(
  sdk: Sdk,
  account: KeyringPair,
  collectionInitial?: TestCollectionInitial,
): Promise<CollectionInfo> {
  const collectionData = collectionInitial || defaultCollectionInitial;
  const txPayload = await sdk.collections.create({
    ...collectionData,
    address: account.address,
  });

  const signature = signWithAccount(sdk, account, txPayload.signerPayloadHex);

  const submitResult = await sdk.extrinsics.submitWaitCompleted({
    signerPayloadJSON: txPayload.signerPayloadJSON,
    signature,
  });

  const collectionCreatedEvent = submitResult.findRecord(
    'common',
    'CollectionCreated',
  );

  if (!collectionCreatedEvent) {
    throw new Error('Create collection fail');
  }
  const collectionId = +collectionCreatedEvent.event.data[0];

  const newCollection = await sdk.collections.get({ collectionId });

  expect(newCollection).toMatchObject(collectionData);

  if (!newCollection) {
    throw new Error('Create collection fail');
  }
  return newCollection;
}
