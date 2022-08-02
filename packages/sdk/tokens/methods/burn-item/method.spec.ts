import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { BurnItemMutation } from './method';
import { BurnItemArguments } from './types';

describe('burn-token', () => {
  let sdk: Sdk;

  let account: TestAccount;

  let mutation: BurnItemMutation;

  beforeAll(async () => {
    sdk = await createSdk(true);

    account = createRichAccount();

    mutation = new BurnItemMutation(sdk);
  });

  it('transformArgs', async () => {
    const collectionId = 1;

    const tokenId = 1;

    const value = 1;

    const args: BurnItemArguments = {
      address: account.address,
      collectionId,
      tokenId,
      value,
    };

    const transformed = await mutation.transformArgs(args);

    const expected = {
      address: account.address,
      section: 'unique',
      method: 'burnItem',
      args: [collectionId, tokenId, value],
    };

    expect(transformed).toMatchObject(expected);
  });
});
