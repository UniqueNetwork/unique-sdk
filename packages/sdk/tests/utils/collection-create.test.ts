import { INamespace } from 'protobufjs';
import { KeyringPair } from '@polkadot/keyring/types';
import { CollectionFields, CollectionFieldTypes } from '@unique-nft/sdk/types';
import {
  CollectionInfo,
  CreateCollectionArguments,
} from '@unique-nft/sdk/tokens/types';
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

const fields: CollectionFields = [
  {
    id: 1,
    type: CollectionFieldTypes.TEXT,
    name: 'ipfsJson',
    required: true,
  },
  {
    id: 2,
    type: CollectionFieldTypes.TEXT,
    name: 'name',
    required: true,
  },
];

export type TestCollectionInitial = Omit<CreateCollectionArguments, 'address'>;
const defaultCollectionInitial: TestCollectionInitial = {
  name: `foo_${Math.floor(Math.random() * 1000)}`,
  description: 'bar',
  tokenPrefix: 'BAZ',
  properties: {
    schemaVersion: 'Unique',
    fields,
  },
  limits: {
    accountTokenOwnershipLimit: 1000,
    sponsoredDataSize: 1024,
    sponsoredDataRateLimit: 30,
    tokenLimit: 1000000,
    sponsorTransferTimeout: 6,
    sponsorApproveTimeout: 6,
    ownerCanTransfer: false,
    ownerCanDestroy: false,
    transfersEnabled: false,
  },
};

export async function createCollection(
  sdk: Sdk,
  account: KeyringPair,
  collectionInitial?: TestCollectionInitial,
): Promise<CollectionInfo> {
  const collectionData = collectionInitial || defaultCollectionInitial;
  const createData = {
    ...collectionData,
    address: account.address,
  };
  const txPayload = await sdk.collections.creation.build(createData);

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
  if (!newCollection) {
    throw new Error('Create collection fail');
  }

  expect(newCollection).toMatchObject(collectionData);

  return newCollection;
}
