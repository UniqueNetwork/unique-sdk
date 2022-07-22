import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { SetTokenPropertiesMutation } from './method';
import { SetTokenPropertiesArguments } from './types';

describe('set-token-properties', () => {
  let sdk: Sdk;

  let account: TestAccount;

  let mutation: SetTokenPropertiesMutation;

  beforeAll(async () => {
    sdk = await createSdk(true);

    account = createRichAccount();

    mutation = new SetTokenPropertiesMutation(sdk);
  });

  it('transformArgs', async () => {
    const collectionId = 1;

    const tokenId = 1;

    const properties = [
      {
        key: 'foo',
        value: 'bar',
      },
    ];

    const args: SetTokenPropertiesArguments = {
      address: account.address,
      collectionId,
      tokenId,
      properties,
    };

    const transformed = await mutation.transformArgs(args);

    const expected = {
      address: account.address,
      section: 'unique',
      method: 'setTokenProperties',
      args: [collectionId, tokenId, properties],
    };

    expect(transformed).toMatchObject(expected);
  });
});
