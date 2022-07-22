import { ethers } from 'ethers';
import { HexString } from '@polkadot/util/types';
import { win } from './types';

import {
  Account,
  SdkSigner,
  SignatureType,
  SignResult,
  UnsignedTxPayload,
} from '../src/types';

function createSigner(address: string): SdkSigner {
  const provider = new ethers.providers.Web3Provider(win.ethereum);
  const signer = provider.getSigner(address);

  return {
    sign: async (unsignedTxPayload: UnsignedTxPayload): Promise<SignResult> => {
      const signature = await signer.signMessage(
        unsignedTxPayload.signerPayloadHex,
      );
      return {
        signature: signature as HexString,
        signatureType: SignatureType.Sr25519,
      };
    },
  };
}

export class MetamaskAccount extends Account<string> {
  #signer: SdkSigner;

  constructor(address: string) {
    super(address);
  }

  public override getSigner(): SdkSigner {
    if (!this.#signer) {
      this.#signer = createSigner(this.instance);
    }

    return this.#signer;
  }
}
