import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { DeleteCollectionPropertiesMutation } from './method';
import { DeleteCollectionPropertiesArguments } from './types';

describe('delete-collection-properties', () => {
  let sdk: Sdk;

  let account: TestAccount;

  let mutation: DeleteCollectionPropertiesMutation;

  beforeAll(async () => {
    sdk = await createSdk(true);

    account = createRichAccount();

    mutation = new DeleteCollectionPropertiesMutation(sdk);
  });

  it('transformArgs', async () => {
    const collectionId = 1;

    const propertyKeys = ['foo', 'bar'];

    const args: DeleteCollectionPropertiesArguments = {
      address: account.address,
      collectionId,
      propertyKeys,
    };

    const transformed = await mutation.transformArgs(args);

    const expected = {
      address: account.address,
      section: 'unique',
      method: 'deleteCollectionProperties',
      args: [collectionId, propertyKeys],
    };

    expect(transformed).toMatchObject(expected);
  });
});
