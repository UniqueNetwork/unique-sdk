import { addFeature } from '@unique-nft/sdk';

export * from './tx';
export * from './sdk-extrinsics';

import { SdkExtrinsics } from './sdk-extrinsics';

import './augment-sdk';

addFeature('extrinsics', SdkExtrinsics);
