import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { BurnTokenMutation } from './method';
import { BurnTokenArguments } from './types';

describe('burn-token', () => {
  let sdk: Sdk;

  let account: TestAccount;

  let mutation: BurnTokenMutation;

  beforeAll(async () => {
    sdk = await createSdk(true);

    account = createRichAccount();

    mutation = new BurnTokenMutation(sdk);
  });

  it('transformArgs', async () => {
    const collectionId = 1;

    const tokenId = 1;

    const value = 1;

    const args: BurnTokenArguments = {
      address: account.address,
      collectionId,
      tokenId,
      value,
    };

    const transformed = await mutation.transformArgs(args);

    const expected = {
      address: account.address,
      section: 'unique',
      method: 'burnToken',
      args: [collectionId, tokenId, value],
    };

    expect(transformed).toMatchObject(expected);
  });
});
