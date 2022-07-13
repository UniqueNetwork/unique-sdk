import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';

import { Sdk } from '../src/lib/sdk';
import {
  createPoorAccount,
  createRichAccount,
  createSdk,
  TestAccount,
} from './testing-utils';
import { createCollection } from './utils/collection-create.test';
import { createToken } from './utils/token-create.test';

describe('Collections and tokens', () => {
  let sdk: Sdk;
  let richAccount: TestAccount;
  let poorAccount: TestAccount;

  beforeAll(async () => {
    sdk = await createSdk(false);
    richAccount = createRichAccount();
    poorAccount = createPoorAccount();
  });

  it('create collection and token', async () => {
    const collection = await createCollection(sdk, richAccount);
    await createToken(sdk, collection.id, richAccount);
  }, 60_000);
  it('create collection and token to other account', async () => {
    const collection = await createCollection(sdk, richAccount);
    await createToken(sdk, collection.id, richAccount, poorAccount);
  }, 60_000);

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
