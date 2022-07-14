import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { SetTokenPropertyPermissionsMutation } from './method';
import { SetTokenPropertyPermissionsArguments } from './types';

describe('set-token-property-permissions', () => {
  let sdk: Sdk;

  let account: TestAccount;

  let mutation: SetTokenPropertyPermissionsMutation;

  beforeAll(async () => {
    sdk = await createSdk(true);

    account = createRichAccount();

    mutation = new SetTokenPropertyPermissionsMutation(sdk);
  });

  it('transformArgs', async () => {
    const collectionId = 1;

    const propertyPermissions = [
      {
        key: 'foo',
        permission: {
          mutable: true,
          collectionAdmin: true,
          tokenOwner: true,
        },
      },
    ];

    const args: SetTokenPropertyPermissionsArguments = {
      address: account.address,
      collectionId,
      propertyPermissions,
    };

    const transformed = await mutation.transformArgs(args);

    const expected = {
      address: account.address,
      section: 'unique',
      method: 'setTokenPropertyPermissions',
      args: [collectionId, propertyPermissions],
    };

    expect(transformed).toMatchObject(expected);
  });
});
