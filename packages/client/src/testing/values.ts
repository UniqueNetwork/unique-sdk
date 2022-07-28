import { CreateCollectionNewRequest } from '../types/api';

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
