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
  let accountFerdie: KeyringPair;
  let accountAlice: KeyringPair;

  beforeAll(async () => {
    sdk = await Sdk.create(getDefaultSdkOptions());
    testAccounts = await getKeyringPairs();
    accountFerdie = testAccounts.ferdie;
    accountAlice = testAccounts.alice;
  });

  it('create collection and token', async () => {
    const collection = await createCollection(sdk, accountFerdie);
    await createToken(sdk, collection.id, accountFerdie);
  }, 60_000);
  it('create collection and token to other account', async () => {
    const collection = await createCollection(sdk, accountFerdie);
    await createToken(sdk, collection.id, accountFerdie, accountAlice);
  }, 60_000);

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
