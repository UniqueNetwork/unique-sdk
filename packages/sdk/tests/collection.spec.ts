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

  async function testCreateTokens({ collectionId }: { collectionId: number }) {
    await createToken(sdk, collectionId, 1, accountFerdie);
    await createToken(sdk, collectionId, 2, accountFerdie, accountAlice);
  }

  it('create collection and token', async () => {
    await createCollection(sdk, accountFerdie).then(testCreateTokens);
  }, 120_000);

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
