import { CreateCollectionNewRequest, CreateTokenNewDto } from '../types/api';

export const inputDataForCreateCollection: CreateCollectionNewRequest = {
  mode: 'Nft',
  name: 'Sample collection name',
  description: 'sample collection description',
  tokenPrefix: 'TEST',
  metaUpdatePermission: 'ItemOwner',
  permissions: {
    access: 'Normal',
    mintMode: true,
    nesting: {
      tokenOwner: true,
      collectionAdmin: true,
    },
  },
  readOnly: true,
  address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
};

export const inputDataForCreateToken: CreateTokenNewDto = {
  address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  collectionId: 1956,
  data: {
    image: {
      urlInfix: 'string',
      hash: 'string',
    },
    encodedAttributes: {
      '0': 0,
      '1': [0, 1],
    },
    name: {
      _: 'Hello!',
    },
    audio: {
      urlInfix: 'string',
      hash: 'string',
    },
    description: {
      _: 'Hello!',
    },
    imagePreview: {
      urlInfix: 'string',
      hash: 'string',
    },
    spatialObject: {
      urlInfix: 'string',
      hash: 'string',
    },
    video: {
      urlInfix: 'string',
      hash: 'string',
    },
  },
  owner: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
};
