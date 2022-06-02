import { INamespace } from 'protobufjs';
import { KeyringPair } from '@polkadot/keyring/types';
import { CreateCollectionArguments } from '@unique-nft/sdk/types';
import { normalizeAddress } from '@unique-nft/sdk/utils';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';

import { Sdk } from '../src/lib/sdk';
import {
  delay,
  getDefaultSdkOptions,
  getKeyringPairs,
  getLastCollectionId,
  signWithAccount,
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
  variableOnChainSchema: '{}',
};

describe(Sdk.name, () => {
  let sdk: Sdk;
  let testAccounts: TestAccounts;
  let accountFerdie: KeyringPair;
  let accountAlice: KeyringPair;

  beforeAll(async () => {
    sdk = await Sdk.create(getDefaultSdkOptions());
    testAccounts = await getKeyringPairs();
    accountFerdie = testAccounts.ferdie;
    accountAlice = testAccounts.alice;
  });

  const createCollection = async (): Promise<{ collectionId: number }> => {
    const txPayload = await sdk.collection.create({
      ...collectionInitial,
      address: accountFerdie.address,
      constOnChainSchema,
    });

    const signature = signWithAccount(
      sdk,
      accountFerdie,
      txPayload.signerPayloadHex,
    );

    await sdk.extrinsics.submit({
      signerPayloadJSON: txPayload.signerPayloadJSON,
      signature,
    });

    await delay(30_000);

    const collectionId = await getLastCollectionId(sdk);

    const newCollection = await sdk.collection.get({ collectionId });

    expect(newCollection).toMatchObject(collectionInitial);

    return { collectionId };
  };

  const createToken = async (
    collectionId: number,
    tokenId: number,
    ownerAddress?: string,
  ): Promise<void> => {
    const txPayload = await sdk.token.create({
      address: accountFerdie.address,
      owner: ownerAddress,
      collectionId,
      constData,
    });

    const signature = signWithAccount(
      sdk,
      accountFerdie,
      txPayload.signerPayloadHex,
    );

    await sdk.extrinsics.submit({
      signerPayloadJSON: txPayload.signerPayloadJSON,
      signature,
    });

    await delay(30_000);

    const newToken = await sdk.token.get({ collectionId, tokenId });

    expect(newToken).toMatchObject({
      owner: normalizeAddress(
        ownerAddress || accountFerdie.address,
        sdk.api.registry.chainSS58,
      ),
      constData,
    });
  };

  async function testCreateTokens({ collectionId }: { collectionId: number }) {
    await createToken(collectionId, 1);
    await createToken(collectionId, 2, accountAlice.address);
  }

  it('create collection and token', async () => {
    await createCollection().then(testCreateTokens);
  }, 120_000);

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
