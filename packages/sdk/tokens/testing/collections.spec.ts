import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/extrinsics';
import { Sdk } from '@unique-nft/sdk';
import { normalizeAddress } from '@unique-nft/sdk/utils';
import {
  CreateCollectionArguments,
  CreateCollectionExMutation,
} from '@unique-nft/sdk/tokens';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/tests';
import { GetStatsResult } from '@unique-nft/sdk/tokens/types';

describe('create-collection-ex', () => {
  let sdk: Sdk;

  let account: TestAccount;

  let creation: CreateCollectionExMutation;

  let createArgs: CreateCollectionArguments;

  let initialStats: GetStatsResult;

  beforeAll(async () => {
    sdk = await createSdk(true);

    account = createRichAccount();

    creation = new CreateCollectionExMutation(sdk);

    createArgs = {
      address: account.address,
      name: `foo_${Math.floor(Math.random() * 1000)}`,
      description: 'bar',
      tokenPrefix: 'BAZ',
      properties: {},
    };

    initialStats = (await sdk.collections.getStats()) as GetStatsResult;
  });

  it('create and get', async () => {
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

    expect(createArgs.address).toBe(
      collection ? normalizeAddress(collection.owner) : null,
    );
    expect(collection).toMatchObject({
      name: createArgs.name,
      description: createArgs.description,
      tokenPrefix: createArgs.tokenPrefix,
    });

    const afterCreationStats =
      (await sdk.collections.getStats()) as GetStatsResult;

    // todo: Should also check 'destroyed' and 'alive' fields when collection deletion will be added.
    expect(afterCreationStats.created).toBe(initialStats.created + 1);
  }, 30_000);
});
