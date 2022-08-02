/**
 * @jest-environment node
 */
import { INestApplication } from '@nestjs/common';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/state-queries';
import '@unique-nft/sdk/extrinsics';
import { Client } from '../index';
import {
  CollectionProperty,
  ExtrinsicResultResponse,
  CollectionPropertySetEvent,
  DeleteCollectionPropertiesBody,
  CollectionPropertyDeletedEvent,
  SetPropertyPermissionsBody,
  PropertyPermissionSetEvent,
  PropertyKeyPermission,
  SetTokenPropertiesBody,
  TokenPropertySetEvent,
  TokenProperty,
  DeleteTokenPropertiesBody,
  TokenPropertyDeletedEvent,
  CreateCollectionParsed,
} from '../types';
import { createClient, createRichAccount, createWeb } from './utils.test';
import {
  inputDataForCreateCollection,
  inputDataForCreateToken,
} from './values';

describe('Properties', () => {
  let app: INestApplication;
  let client: Client;
  let address: string;
  let collectionId: number;
  const tokenId = 1;

  beforeAll(async () => {
    if (!app) {
      app = await createWeb();
    }

    client = await createClient(true);
    address = createRichAccount().address;

    const createCollectionResponse: ExtrinsicResultResponse<CreateCollectionParsed> =
      await client.collections.creation.submitWaitResult(
        inputDataForCreateCollection,
      );

    collectionId = createCollectionResponse.parsed.collectionId;

    await client.tokens.create.submitWaitResult({
      ...inputDataForCreateToken,
      collectionId,
      address,
      owner: address,
    });
  }, 100_000);

  afterAll(() => {
    app.close();
  });

  it('Set collection properties', async () => {
    const properties: CollectionProperty[] = [
      {
        key: 'test',
        value: 'test',
      },
    ];

    const result = await client.collections.setProperties.submitWaitResult({
      address,
      collectionId,
      properties,
    });

    const expected: CollectionPropertySetEvent[] = [
      {
        collectionId,
        propertyKey: 'test',
      },
    ];

    expect(result.parsed).toMatchObject(expected);
  }, 60_000);

  it('Get collection properties', async () => {
    const result = await client.collections.properties({
      collectionId,
    });

    const expected: CollectionProperty[] = [
      {
        key: 'test',
        value: 'test',
      },
    ];

    expect(result).toMatchObject(expected);
  }, 60_000);

  it('Delete collection properties', async () => {
    const propertyKeys = ['test'];

    const args: DeleteCollectionPropertiesBody = {
      address,
      collectionId,
      propertyKeys,
    };

    const result = await client.collections.deleteProperties.submitWaitResult(
      args,
    );

    const expected: CollectionPropertyDeletedEvent[] = [
      {
        collectionId,
        propertyKey: 'test',
      },
    ];

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);

  it('Set token property permissions', async () => {
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
    const args: SetPropertyPermissionsBody = {
      address,
      collectionId,
      propertyPermissions,
    };

    const result =
      await client.collections.setPropertyPermissions.submitWaitResult(args);

    const expected: PropertyPermissionSetEvent[] = [
      {
        collectionId,
        propertyKey: 'test',
      },
    ];

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);

  it('Get property permissions', async () => {
    const args = {
      collectionId,
    };

    const result = await client.collections.propertyPermissions(args);

    const expected: PropertyKeyPermission[] = [
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

  it('Set token properties', async () => {
    const properties = [
      {
        key: 'test',
        value: 'test',
      },
    ];

    const args: SetTokenPropertiesBody = {
      address,
      collectionId,
      tokenId,
      properties,
    };

    const result = await client.tokens.setProperties.submitWaitResult(args);

    const expected: TokenPropertySetEvent[] = [
      {
        collectionId,
        tokenId,
        propertyKey: 'test',
      },
    ];

    expect(result.parsed).toMatchObject(expected);
  }, 60_000);

  it('Get token properties', async () => {
    const result = await client.tokens.properties({
      collectionId,
      tokenId,
    });

    const expected: TokenProperty[] = [
      {
        key: 'test',
        value: 'test',
      },
    ];

    expect(result).toStrictEqual(expected);
  }, 30_000);

  it('Delete token properties', async () => {
    const propertyKeys = ['test'];

    const args: DeleteTokenPropertiesBody = {
      address,
      collectionId,
      tokenId,
      propertyKeys,
    };

    const result = await client.tokens.deleteProperties.submitWaitResult(args);

    const expected: TokenPropertyDeletedEvent[] = [
      {
        collectionId,
        tokenId,
        propertyKey: 'test',
      },
    ];

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);
});
