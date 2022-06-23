import { KeyringPair } from '@polkadot/keyring/types';
import { CreateCollectionArguments } from '@unique-nft/sdk/types';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import { Sdk } from '@unique-nft/sdk';
import { createSdk, getKeyringPairs } from '@unique-nft/sdk/tests';

import { CreateCollectionExMutation } from './method';

describe('create-collection-ex', () => {
  let sdk: Sdk;

  let account: KeyringPair;

  let creation: CreateCollectionExMutation;

  let createArgs: CreateCollectionArguments;

  beforeAll(async () => {
    sdk = await createSdk({
      seed: '//Alice',
    });

    const testAccounts = await getKeyringPairs();

    account = testAccounts.alice;

    creation = new CreateCollectionExMutation(sdk);

    createArgs = {
      address: account.address,
      name: `foo_${Math.floor(Math.random() * 1000)}`,
      description: 'bar',
      tokenPrefix: 'BAZ',
      properties: {},
    };
  });

  it('transformArgs', async () => {
    const transformed = await creation.transformArgs(createArgs);

    expect(transformed).toMatchObject({
      address: createArgs.address,
      section: 'unique',
      method: 'createCollectionEx',
      args: [expect.any(String)],
    });
  });

  it('create - ok', async () => {
    const createResult = await creation.submitWaitResult(createArgs);

    expect(createResult).toMatchObject({
      submittableResult: expect.any(Object),
      isCompleted: true,
      parsed: {
        collectionId: expect.any(Number),
      },
    });

    const collection = await sdk.collections.get({
      collectionId: createResult.parsed.collectionId,
    });

    expect(collection).toMatchObject({
      owner: createArgs.address,
      name: createArgs.name,
      description: createArgs.description,
      tokenPrefix: createArgs.tokenPrefix,
    });
  }, 30_000);
});
