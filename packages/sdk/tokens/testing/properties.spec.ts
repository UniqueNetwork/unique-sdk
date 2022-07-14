import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import {
  DeleteTokenPropertiesResult,
  DeleteTokenPropertiesArguments,
} from '../methods/delete-token-properties';
import {
  SetTokenPropertiesArguments,
  SetTokenPropertiesResult,
} from '../methods/set-token-properties';
import {
  SetTokenPropertyPermissionsResult,
  SetTokenPropertyPermissionsArguments,
} from '../methods/set-token-property-permissions';
import {
  DeleteCollectionPropertiesArguments,
  DeleteCollectionPropertiesResult,
} from '../methods/delete-collection-properties';
import {
  SetCollectionPropertiesArguments,
  SetCollectionPropertiesResult,
} from '../methods/set-collection-properties';

describe('Properties', () => {
  let sdk: Sdk;
  let richAccount: TestAccount;
  let collectionId: number;
  const tokenId = 1;

  beforeAll(async () => {
    sdk = await createSdk(true);
    richAccount = createRichAccount();

    const result = await sdk.collections.creation.submitWaitResult({
      address: richAccount.address,
      description: 'Properties testing collection',
      name: 'Test',
      tokenPrefix: 'TEST',
      properties: {},
      permissions: {
        nesting: {
          tokenOwner: true,
          collectionAdmin: true,
        },
      },
    });

    collectionId = result.parsed.collectionId;

    await new Promise((resolve) => {
      const tokens = [{ NFT: {} }, { NFT: {} }, { NFT: {} }];
      const tx = sdk.api.tx.unique.createMultipleItems(
        collectionId,
        { Substrate: richAccount.address },
        tokens,
      );
      tx.signAndSend(richAccount.keyringPair, ({ status }) => {
        if (status.isInBlock) {
          resolve({});
        }
      });
    });
  }, 2 * 60_000);

  it('set-collection-properties', async () => {
    const properties = [
      {
        key: 'foo',
        value: 'FOO',
      },
      {
        key: 'bar',
        value: 'BAR',
      },
    ];

    const args: SetCollectionPropertiesArguments = {
      address: richAccount.address,
      collectionId,
      properties,
    };

    const result = await sdk.collections.setProperties.submitWaitResult(args);

    const expected: SetCollectionPropertiesResult = [
      {
        collectionId,
        property: 'foo',
      },
      {
        collectionId,
        property: 'bar',
      },
    ];

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);

  it('delete-collection-properties', async () => {
    const propertyKeys = ['foo', 'bar'];

    const args: DeleteCollectionPropertiesArguments = {
      address: richAccount.address,
      collectionId,
      propertyKeys,
    };

    const result = await sdk.collections.deleteProperties.submitWaitResult(
      args,
    );

    const expected: DeleteCollectionPropertiesResult = [
      {
        collectionId,
        property: 'foo',
      },
      {
        collectionId,
        property: 'bar',
      },
    ];

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);

  it('set-token-property-permissions', async () => {
    const propertyPermissions = [
      {
        key: 'foo',
        permission: {
          mutable: true,
          collectionAdmin: true,
          tokenOwner: true,
        },
      },
      {
        key: 'bar',
        permission: {
          mutable: true,
          collectionAdmin: true,
          tokenOwner: true,
        },
      },
    ];
    const args: SetTokenPropertyPermissionsArguments = {
      address: richAccount.address,
      collectionId,
      propertyPermissions,
    };

    const result =
      await sdk.collections.setTokenPropertyPermissions.submitWaitResult(args);

    const expected: SetTokenPropertyPermissionsResult = [
      {
        collectionId,
        property: 'foo',
      },
      {
        collectionId,
        property: 'bar',
      },
    ];

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);

  it('set-token-properties', async () => {
    const properties = [
      {
        key: 'foo',
        value: 'FOO',
      },
      {
        key: 'bar',
        value: 'BAR',
      },
    ];

    const args: SetTokenPropertiesArguments = {
      address: richAccount.address,
      collectionId,
      tokenId,
      properties,
    };

    const result = await sdk.tokens.setProperties.submitWaitResult(args);

    const expected: SetTokenPropertiesResult = [
      {
        collectionId,
        tokenId,
        property: 'foo',
      },
      {
        collectionId,
        tokenId,
        property: 'bar',
      },
    ];

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);

  it('delete-token-properties', async () => {
    const propertyKeys = ['foo', 'bar'];

    const args: DeleteTokenPropertiesArguments = {
      address: richAccount.address,
      collectionId,
      tokenId,
      propertyKeys,
    };

    const result = await sdk.tokens.deleteProperties.submitWaitResult(args);

    const expected: DeleteTokenPropertiesResult = [
      {
        collectionId,
        tokenId,
        property: 'foo',
      },
      {
        collectionId,
        tokenId,
        property: 'bar',
      },
    ];

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);
});
