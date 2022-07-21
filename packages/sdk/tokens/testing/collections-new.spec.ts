import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/extrinsics';
import { Sdk } from '@unique-nft/sdk';
import { normalizeAddress } from '@unique-nft/sdk/utils';
import {
  UniqueCollectionSchemaToCreate,
  CollectionSchemaName,
  AttributeType,
  AttributeKind,
} from '@unique-nft/sdk/tokens';

import {
  CreateCollectionExNewMutation,
  CreateCollectionNewArguments,
} from '@unique-nft/sdk/tokens/methods/create-collection-ex-new';
import {
  CreateTokenNewMutation,
  CreateTokenNewArguments,
} from '@unique-nft/sdk/tokens/methods/create-token';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';

const collectionSchemaToCreate: UniqueCollectionSchemaToCreate = {
  attributesSchema: {
    '0': {
      name: {
        en: 'gender',
      },
      type: 'localizedStringDictionary',
      kind: 'enum',
      enumValues: {
        '0': {
          en: 'Male',
        },
        '1': {
          en: 'Female',
        },
      },
    },
    '1': {
      name: {
        en: 'traits',
      },
      type: 'localizedStringDictionary',
      kind: 'enumMultiple',
      enumValues: {
        '0': {
          en: 'Black Lipstick',
        },
        '1': {
          en: 'Red Lipstick',
        },
      },
    },
    '2': {
      name: 'just_string_value',
      type: 'string',
      kind: 'freeValue',
    },
  },
  attributesSchemaVersion: '1.0.0',
  coverPicture: {
    urlInfix: 'string',
    hash: 'string',
  },
  image: {
    urlTemplate: 'https://ipfs.unique.network/ipfs/{infix}.ext',
  },
  schemaName: CollectionSchemaName.unique,
  schemaVersion: '1.0.0',
  coverPicturePreview: {
    urlInfix: 'string',
    hash: 'string',
  },
  imagePreview: {
    urlTemplate: 'https://ipfs.unique.network/ipfs/{infix}.ext',
  },
  audio: {
    urlTemplate: 'https://ipfs.unique.network/ipfs/{infix}.ext',
    format: 'string',
    isLossless: true,
  },
  spatialObject: {
    urlTemplate: 'https://ipfs.unique.network/ipfs/{infix}.ext',
    format: 'string',
  },
  video: {
    urlTemplate: 'https://ipfs.unique.network/ipfs/{infix}.ext',
  },
};

describe('unique schema collection and token', () => {
  let sdk: Sdk;

  let richAccount: TestAccount;

  let collectionCreation: CreateCollectionExNewMutation;
  let createCollectionArgs: CreateCollectionNewArguments;

  let tokenCreation: CreateTokenNewMutation;
  let createTokenArgs: CreateTokenNewArguments;

  beforeAll(async () => {
    sdk = await createSdk(true);

    richAccount = createRichAccount();

    collectionCreation = new CreateCollectionExNewMutation(sdk);

    createCollectionArgs = {
      mode: 'Nft',
      name: 'Sample collection name',
      description: 'sample collection description',
      tokenPrefix: 'TEST',
      limits: {
        accountTokenOwnershipLimit: 1000,
        sponsoredDataSize: 1024,
        sponsoredDataRateLimit: 30,
        tokenLimit: 1000000,
        sponsorTransferTimeout: 6,
        sponsorApproveTimeout: 6,
        ownerCanTransfer: false,
        ownerCanDestroy: false,
        transfersEnabled: false,
      },
      metaUpdatePermission: 'ItemOwner',
      permissions: {
        access: 'Normal',
        mintMode: true,
        nesting: {
          tokenOwner: true,
          collectionAdmin: true,
        },
      },
      address: richAccount.address,
      schema: collectionSchemaToCreate,
    };

    tokenCreation = new CreateTokenNewMutation(sdk);
    createTokenArgs = {
      address: richAccount.address,
      collectionId: -1,
      data: {
        encodedAttributes: {
          '0': 0,
          '1': [0],
          '2': 'foo_bar',
        },
        image: {
          ipfsCid: 'foo',
        },
      },
    };
  });

  it('create and get', async () => {
    const createCollectionResult = await collectionCreation.submitWaitResult(
      createCollectionArgs,
    );

    expect(createCollectionResult).toMatchObject({
      submittableResult: expect.any(Object),
      isCompleted: true,
      parsed: {
        collectionId: expect.any(Number),
      },
    });

    const { collectionId } = createCollectionResult.parsed;

    const createTokenResult = await tokenCreation.submitWaitResult({
      ...createTokenArgs,
      collectionId,
    });

    expect(createTokenResult).toMatchObject({
      submittableResult: expect.any(Object),
      isCompleted: true,
      parsed: {
        collectionId: expect.any(Number),
        tokenId: expect.any(Number),
      },
    });

    const { tokenId } = createTokenResult.parsed;

    const collection = await sdk.collections.get_new({ collectionId });
    const token = await sdk.tokens.get_new({ collectionId, tokenId });

    expect(collection).toBeDefined();
    expect(token).toBeDefined();

    expect(createCollectionArgs.address).toBe(
      collection ? normalizeAddress(collection.owner) : null,
    );

    expect(collection).toMatchObject({
      name: createCollectionArgs.name,
      description: createCollectionArgs.description,
      tokenPrefix: createCollectionArgs.tokenPrefix,
    });

    expect(collection?.schema?.attributesSchema).toEqual(
      collectionSchemaToCreate.attributesSchema,
    );

    expect(token?.attributes).toEqual({
      '0': {
        isArray: false,
        kind: AttributeKind.enum,
        name: {
          en: 'gender',
        },
        technicalKindName: 'enum',
        technicalTypeName: 'localizedStringDictionary',
        type: AttributeType.localizedStringDictionary,
        value: {
          en: 'Male',
        },
      },
      '1': {
        isArray: true,
        kind: AttributeKind.enumMultiple,
        name: {
          en: 'traits',
        },
        technicalKindName: 'enumMultiple',
        technicalTypeName: 'localizedStringDictionary',
        type: AttributeType.localizedStringDictionary,
        value: [
          {
            en: 'Black Lipstick',
          },
        ],
      },
      '2': {
        isArray: false,
        kind: AttributeKind.freeValue,
        name: 'just_string_value',
        technicalKindName: 'freeValue',
        technicalTypeName: 'string',
        type: AttributeType.string,
        value: 'foo_bar',
      },
    });
  }, 60_000);
});
