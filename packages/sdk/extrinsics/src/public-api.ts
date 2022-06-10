import { addFeature } from '@unique-nft/sdk';

import { SdkExtrinsics } from './sdk-extrinsics';

import './augment-sdk';

export * from './tx-utils';
export * from './sdk-extrinsics';

addFeature('extrinsics', SdkExtrinsics);
