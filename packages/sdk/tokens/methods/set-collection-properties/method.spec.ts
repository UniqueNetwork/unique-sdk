import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { SetCollectionPropertiesMutation } from './method';
import { SetCollectionPropertiesArguments } from './types';

describe('set-collection-properties', () => {
  let sdk: Sdk;

  let account: TestAccount;

  let mutation: SetCollectionPropertiesMutation;

  beforeAll(async () => {
    sdk = await createSdk(true);

    account = createRichAccount();

    mutation = new SetCollectionPropertiesMutation(sdk);
  });

  it('transformArgs', async () => {
    const collectionId = 1;

    const properties = [
      {
        key: 'foo',
        value: 'bar',
      },
    ];

    const args: SetCollectionPropertiesArguments = {
      address: account.address,
      collectionId,
      properties,
    };

    const transformed = await mutation.transformArgs(args);

    const expected = {
      address: account.address,
      section: 'unique',
      method: 'setCollectionProperties',
      args: [collectionId, properties],
    };

    expect(transformed).toMatchObject(expected);
  });
});
