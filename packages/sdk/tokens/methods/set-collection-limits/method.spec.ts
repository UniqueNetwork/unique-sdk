import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/tests';
import { SetCollectionLimitsMutation } from './method';
import { SetCollectionLimitsArguments } from './types';
import { CreateCollectionExMutation } from '../create-collection-ex/method';

describe('set-collection-limits', () => {
  let sdk: Sdk;

  let richAccount: TestAccount;

  let limits: SetCollectionLimitsMutation;

  let limitsArgs: SetCollectionLimitsArguments;

  beforeAll(async () => {
    sdk = await createSdk(true);

    richAccount = createRichAccount();
    limits = new SetCollectionLimitsMutation(sdk);

    limitsArgs = {
      address: richAccount.address,
      collectionId: 1,
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
      address: richAccount.address,
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
        limits: expect.any(Object),
      },
    });
  }, 60_000);
});
