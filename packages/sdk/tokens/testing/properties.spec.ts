import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import {
  CollectionPropertiesArguments,
  CollectionPropertiesResult,
  TokenPropertiesArguments,
  TokenPropertiesResult,
  DeleteTokenPropertiesResult,
  DeleteTokenPropertiesArguments,
  SetTokenPropertiesArguments,
  SetTokenPropertiesResult,
  SetTokenPropertyPermissionsResult,
  SetTokenPropertyPermissionsArguments,
  DeleteCollectionPropertiesArguments,
  DeleteCollectionPropertiesResult,
  SetCollectionPropertiesArguments,
  SetCollectionPropertiesResult,
  PropertyPermissionsArguments,
  PropertyPermissionsResult,
} from '@unique-nft/sdk/tokens';

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
        key: 'test',
        value: 'test',
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
        property: 'test',
      },
    ];

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);

  it('collection-properties', async () => {
    const args: CollectionPropertiesArguments = {
      collectionId,
    };

    const result = await sdk.collections.properties(args);

    const expected: CollectionPropertiesResult = [
      {
        key: 'test',
        value: 'test',
      },
    ];

    expect(result).toMatchObject(expected);
  }, 15_000);

  it('delete-collection-properties', async () => {
    const propertyKeys = ['test'];

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
        property: 'test',
      },
    ];

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);

  it('set-token-property-permissions', async () => {
    const propertyPermissions = [
      {
        key: 'test',
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
      await sdk.collections.setPropertyPermissions.submitWaitResult(args);

    const expected: SetTokenPropertyPermissionsResult = [
      {
        collectionId,
        property: 'test',
      },
    ];

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);

  it('property-permissions', async () => {
    const args: PropertyPermissionsArguments = {
      collectionId,
    };

    const result = await sdk.collections.propertyPermissions(args);

    const expected: PropertyPermissionsResult = [
      {
        key: '_old_constData',
        permission: {
          collectionAdmin: true,
          mutable: false,
          tokenOwner: true,
        },
      },
      {
        key: 'test',
        permission: {
          mutable: true,
          collectionAdmin: true,
          tokenOwner: true,
        },
      },
    ];

    expect(result).toMatchObject(expected);
  }, 30_000);

  it('set-token-properties', async () => {
    const properties = [
      {
        key: 'test',
        value: 'test',
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
        property: 'test',
      },
    ];

    expect(result.parsed).toMatchObject(expected);
  }, 60_000);

  it('token-properties', async () => {
    const args: TokenPropertiesArguments = {
      collectionId,
      tokenId,
    };

    const result = await sdk.tokens.properties(args);

    const expected: TokenPropertiesResult = [
      {
        key: 'test',
        value: 'test',
      },
    ];

    expect(result).toStrictEqual(expected);
  }, 30_000);

  it('delete-token-properties', async () => {
    const propertyKeys = ['test'];

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
        property: 'test',
      },
    ];

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);
});
