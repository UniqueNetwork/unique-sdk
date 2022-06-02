import { INamespace } from 'protobufjs';
import { KeyringPair } from '@polkadot/keyring/types';
import { CreateCollectionArguments } from '@unique-nft/sdk/types';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import {
  delay,
  getLastCollectionId,
  signWithAccount,
} from '@unique-nft/sdk/tests/testing-utils';
import { Sdk } from '@unique-nft/sdk';

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

export async function createCollection(
  sdk: Sdk,
  account: KeyringPair,
): Promise<{ collectionId: number }> {
  const txPayload = await sdk.collection.create({
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

  const newCollection = await sdk.collection.get({ collectionId });

  expect(newCollection).toMatchObject(collectionInitial);

  return { collectionId };
}
