import { addFeature } from '@unique-nft/sdk';

import { SdkStateQueries } from './sdk-state-queries';
import './augment-sdk';

export { SdkStateQueries } from './sdk-state-queries';

addFeature('stateQueries', SdkStateQueries);
