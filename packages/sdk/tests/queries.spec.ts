import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { Sdk } from '@unique-nft/sdk';
import { BuildQueryError } from '@unique-nft/sdk/errors';
import '@unique-nft/sdk/state-queries';

import { getDefaultSdkOptions } from './testing-utils';

describe('Sdk Queries', () => {
  let sdk: Sdk;
  let alice: KeyringPair;
  let bob: KeyringPair;

  beforeAll(async () => {
    sdk = await Sdk.create(getDefaultSdkOptions());

    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
    bob = new Keyring({ type: 'sr25519' }).addFromUri('//Bob');
  });

  it('derive.balances.all', async () => {
    const result = await sdk.stateQueries.execute({
      endpoint: 'derive',
      module: 'balances',
      method: 'all',
      args: [alice.address],
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
      args: [alice.address],
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
          args: [alice.address],
        });
      }).rejects.toThrowError(new BuildQueryError(errorMessage));
    },
  );

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
