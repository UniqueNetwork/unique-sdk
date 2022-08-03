import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { DeleteTokenPropertiesMutation } from './method';
import { DeleteTokenPropertiesArguments } from './types';

describe('delete-token-properties', () => {
  let sdk: Sdk;

  let account: TestAccount;

  let mutation: DeleteTokenPropertiesMutation;

  beforeAll(async () => {
    sdk = await createSdk(true);

    account = createRichAccount();

    mutation = new DeleteTokenPropertiesMutation(sdk);
  });

  it('transformArgs', async () => {
    const collectionId = 1;

    const tokenId = 1;

    const propertyKeys = ['foo', 'bar'];

    const args: DeleteTokenPropertiesArguments = {
      address: account.address,
      collectionId,
      tokenId,
      propertyKeys,
    };

    const transformed = await mutation.transformArgs(args);

    const expected = {
      address: account.address,
      section: 'unique',
      method: 'deleteTokenProperties',
      args: [collectionId, tokenId, propertyKeys],
    };

    expect(transformed).toMatchObject(expected);
  });
});
