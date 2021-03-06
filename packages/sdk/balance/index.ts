import { addFeature } from '@unique-nft/sdk';
import '@unique-nft/sdk/extrinsics';

import { SdkBalance } from './sdk-balance';
import './augment-sdk';

export { SdkBalance } from './sdk-balance';
export * from './types';

addFeature('balance', SdkBalance);
