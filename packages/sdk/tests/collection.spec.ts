import { KeyringPair } from '@polkadot/keyring/types';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';

import { Sdk } from '../src/lib/sdk';
import {
  getDefaultSdkOptions,
  getKeyringPairs,
  TestAccounts,
} from './testing-utils';
import { createCollection } from './utils/collection-create.test';
import { createToken } from './utils/token-create.test';

describe('Collections and tokens', () => {
  let sdk: Sdk;
  let testAccounts: TestAccounts;
  let accountBob: KeyringPair;
  let accountAlice: KeyringPair;

  beforeAll(async () => {
    sdk = await Sdk.create(getDefaultSdkOptions());
    testAccounts = await getKeyringPairs();
    accountBob = testAccounts.bob;
    accountAlice = testAccounts.alice;
  });

  it('create collection and token', async () => {
    const collection = await createCollection(sdk, accountBob);
    await createToken(sdk, collection.id, accountBob);
  }, 60_000);
  it('create collection and token to other account', async () => {
    const collection = await createCollection(sdk, accountBob);
    await createToken(sdk, collection.id, accountBob, accountAlice);
  }, 60_000);

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
