import { Sdk } from '@unique-nft/sdk';
import { createSdk, getKeyringPairs } from '@unique-nft/sdk/tests';
import { SetCollectionLimitsMutation } from '@unique-nft/sdk/tokens/methods/set-collection-limits/method';
import { SetCollectionLimitsArguments } from '@unique-nft/sdk/tokens';
import { CreateCollectionExMutation } from '@unique-nft/sdk/tokens/methods/create-collection-ex/method';
import { KeyringPair } from '@polkadot/keyring/types';

describe('set-collection-limits', () => {
  let sdk: Sdk;

  let account: KeyringPair;

  let limits: SetCollectionLimitsMutation;

  let limitsArgs: SetCollectionLimitsArguments;

  beforeAll(async () => {
    sdk = await createSdk({
      seed: '//Alice',
    });

    const testAccounts = await getKeyringPairs();

    account = testAccounts.alice;
    limits = new SetCollectionLimitsMutation(sdk);

    limitsArgs = {
      address: account.address,
      collectionId: 1,
      accountTokenOwnershipLimit: 0,
      sponsoredDataSize: 0,
      tokenLimit: 10,
      sponsorTransferTimeout: 1,
      ownerCanTransfer: true,
      ownerCanDestroy: true,
    };
  });

  it('transformArgs', async () => {
    const transformed = await limits.transformArgs(limitsArgs);

    expect(transformed).toMatchObject({
      address: limitsArgs.address,
      section: 'unique',
      method: 'setCollectionLimits',
      args: expect.any(Array),
    });
  });

  it('set collection limits', async () => {
    const createArgs = {
      address: account.address,
      name: `foo_${Math.floor(Math.random() * 1000)}`,
      description: 'bar',
      tokenPrefix: 'BAZ',
      properties: {},
    };
    const creation = new CreateCollectionExMutation(sdk);
    const createResult = await creation.submitWaitResult(createArgs);

    const limitResult = await limits.submitWaitResult({
      ...limitsArgs,
      collectionId: createResult.parsed.collectionId,
    });

    expect(limitResult).toMatchObject({
      submittableResult: expect.any(Object),
      isCompleted: true,
      parsed: {
        collectionId: expect.any(Number),
      },
    });
  }, 60_000);
});
