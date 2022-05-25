import { addFeature } from '@unique-nft/sdk';

import { SdkBalance } from './sdk-balance';
import './augment-sdk';

export { SdkBalance } from './sdk-balance';

addFeature('balance', SdkBalance);
