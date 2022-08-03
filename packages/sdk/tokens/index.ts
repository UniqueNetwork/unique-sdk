import { addFeature } from '@unique-nft/sdk';
import '@unique-nft/sdk/extrinsics';

import { SdkCollections } from './sdk-collections';
import { SdkTokens } from './sdk-tokens';
import './augment-sdk';

export * from './utils';
export { SdkCollections } from './sdk-collections';
export { SdkTokens } from './sdk-tokens';
export * from './types';

export { CreateCollectionExMutation } from './methods/create-collection-ex';
export { CreateCollectionExNewMutation } from './methods/create-collection-ex-new';

addFeature('collections', SdkCollections);
addFeature('tokens', SdkTokens);
