import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { Sdk } from '@unique-nft/sdk';
import { QueryController } from '@unique-nft/sdk/types';
import { SdkStateQueries } from '@unique-nft/sdk/state-queries';
import { BuildQueryError } from '@unique-nft/sdk/errors';

import { getDefaultSdkOptions } from './testing-utils';

console.log('SdkStateQueries', SdkStateQueries);

describe('Queries', () => {
  let sdk: Sdk;
  let alice: KeyringPair;
  let bob: KeyringPair;

  beforeAll(async () => {
    sdk = await Sdk.create(getDefaultSdkOptions());

    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
    bob = new Keyring({ type: 'sr25519' }).addFromUri('//Bob');
  });

  it('query ok', async () => {
    const result = await sdk.stateQueries.execute({
      controller: QueryController.derive,
      section: 'balances',
      method: 'all',
      args: [alice.address],
    });
    expect(result).toMatchObject({
      availableBalance: expect.any(Object),
    });
  });

  it('query fail', async () => {
    await expect(async () => {
      await sdk.stateQueries.execute({
        controller: QueryController.derive,
        section: 'balance',
        method: 'all',
        args: [alice.address],
      });
    }).rejects.toThrowError(
      new BuildQueryError({}, 'Invalid section: "balance"'),
    );
  });

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
