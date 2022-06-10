import { addFeature } from '@unique-nft/sdk';

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

addFeature('collections', SdkCollections);
addFeature('tokens', SdkTokens);
