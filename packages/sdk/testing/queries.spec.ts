import { Sdk } from '@unique-nft/sdk';
import { BuildQueryError } from '@unique-nft/sdk/errors';
import '@unique-nft/sdk/state-queries';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';

describe('Sdk Queries', () => {
  let sdk: Sdk;

  let richAccount: TestAccount;

  beforeAll(async () => {
    sdk = await createSdk(false);

    richAccount = createRichAccount();
  });

  it('derive.balances.all', async () => {
    const result = await sdk.stateQueries.execute({
      endpoint: 'derive',
      module: 'balances',
      method: 'all',
      args: [richAccount.address],
    });
    expect(result).toMatchObject({
      availableBalance: expect.any(Object),
    });
  });

  it('derive.accounts.accountId', async () => {
    const result = await sdk.stateQueries.execute({
      endpoint: 'derive',
      module: 'accounts',
      method: 'accountId',
      args: [richAccount.address],
    });
    expect(result).toMatchObject({
      rawType: 'AccountId',
      human: expect.any(String),
      json: expect.any(String),
      hex: expect.any(String),
    });
  });

  it.each([
    ['derive1', 'balances1', 'all', 'Invalid endpoint: "derive1"'],
    ['derive', 'balances1', 'all', 'Invalid module: "balances1"'],
    ['derive', 'balances', 'all1', 'Invalid method: "all1"'],
  ])(
    'fail - %s.%s.%s',
    async (
      endpoint: string,
      module: string,
      method: string,
      errorMessage: string,
    ) => {
      await expect(async () => {
        await sdk.stateQueries.execute({
          endpoint,
          module,
          method,
          args: [richAccount.address],
        });
      }).rejects.toThrowError(new BuildQueryError(errorMessage));
    },
  );

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
