import { addFeature } from '@unique-nft/sdk';

import { SdkCollection } from './sdk-collection';
import { SdkToken } from './sdk-token';
import './augment-sdk';

export * from './utils';
export { SdkCollection } from './sdk-collection';
export { SdkToken } from './sdk-token';

addFeature('collection', SdkCollection);
addFeature('token', SdkToken);
