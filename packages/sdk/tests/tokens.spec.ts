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

describe('Sdk Tokens', () => {
  let sdk: Sdk;
  let richAccount: TestAccount;
  let poorAccount: TestAccount;

  beforeAll(async () => {
    sdk = await createSdk(true);

    richAccount = createRichAccount();
    poorAccount = createPoorAccount();
  });

  it('transfer', async () => {
    const collection = await createCollection(sdk, richAccount);
    const token = await createToken(
      sdk,
      collection.id,
      richAccount,
      poorAccount,
    );
    const unsignedPayload = await sdk.tokens.transfer({
      from: richAccount.address,
      to: poorAccount.address,
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
