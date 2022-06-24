import { addFeature } from '@unique-nft/sdk';

import { SdkExtrinsics } from './sdk-extrinsics';

import './augment-sdk';

export * from './tx-utils';
export * from './sdk-extrinsics';
export * from './mutation-method';
export * from './query-method';

addFeature('extrinsics', SdkExtrinsics);
