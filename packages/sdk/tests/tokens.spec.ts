import { KeyringPair } from '@polkadot/keyring/types';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';

import { Sdk } from '../src/lib/sdk';
import { createSdk, getKeyringPairs, TestAccounts } from './testing-utils';
import { createCollection } from './utils/collection-create.test';
import { createToken } from './utils/token-create.test';

describe('Sdk Tokens', () => {
  let sdk: Sdk;
  let testAccounts: TestAccounts;
  let alice: KeyringPair;
  let bob: KeyringPair;

  beforeAll(async () => {
    sdk = await createSdk({
      seed: '//Alice',
    });
    testAccounts = await getKeyringPairs();
    alice = testAccounts.alice;
    bob = testAccounts.bob;
  });

  it('transfer', async () => {
    const collection = await createCollection(sdk, alice);
    const token = await createToken(sdk, collection.id, alice, bob);
    const unsignedPayload = await sdk.tokens.transfer({
      from: alice.address,
      to: bob.address,
      collectionId: collection.id,
      tokenId: token.id,
    });
    const signResult = await sdk.extrinsics.sign(unsignedPayload);
    const submitResult = await sdk.extrinsics.submit({
      signerPayloadJSON: unsignedPayload.signerPayloadJSON,
      signature: signResult.signature,
    });
    expect(submitResult).toMatchObject({
      hash: expect.any(String),
    });
  }, 120_000);

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
