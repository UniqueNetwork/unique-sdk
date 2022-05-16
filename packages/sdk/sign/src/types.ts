import { HexString } from '@polkadot/util/types';

export interface SdkSigner {
  sign(payload: string): HexString;
}
