import { addFeature } from '@unique-nft/sdk';
import '@unique-nft/sdk/extrinsics';

import { SdkFungible } from './sdk-fungible';
import './augment-sdk';

export { SdkFungible } from './sdk-fungible';

export * from './methods';

addFeature('fungible', SdkFungible);
