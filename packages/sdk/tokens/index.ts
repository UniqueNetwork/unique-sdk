import { addFeature } from '@unique-nft/sdk';
import '@unique-nft/sdk/extrinsics';

import { SdkCollections } from './sdk-collections';
import { SdkTokens } from './sdk-tokens';
import './augment-sdk';

export {
  encodeToken,
  decodeToken,
  encodeCollection,
  decodeCollection,
} from './utils';
export { SdkCollections } from './sdk-collections';
export { SdkTokens } from './sdk-tokens';
export * from './types';

export { CreateCollectionExMutation } from './methods/create-collection-ex';

addFeature('collections', SdkCollections);
addFeature('tokens', SdkTokens);
