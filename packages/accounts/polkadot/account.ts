import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from '@polkadot/extension-inject/types';
import {
  Account,
  SdkSigner,
  SignatureType,
  SignResult,
  UnsignedTxPayload,
} from '../src/types';

function createSigner(
  injectedAccount: InjectedAccountWithMeta,
  injector: InjectedExtension,
): SdkSigner {
  return {
    sign: async (unsignedTxPayload: UnsignedTxPayload): Promise<SignResult> => {
      const signPayload = injector?.signer?.signPayload;
      if (!signPayload) {
        throw new Error('Fail sign message');
      }

      const { signature } = await signPayload(
        unsignedTxPayload.signerPayloadJSON,
      );

      return {
        signature,
        signatureType: injectedAccount.type as SignatureType,
      };
    },
  };
}

export class PolkadotAccount extends Account<InjectedAccountWithMeta> {
  #injector: InjectedExtension;

  #signer: SdkSigner;

  constructor(
    injectedAccount: InjectedAccountWithMeta,
    injector: InjectedExtension,
  ) {
    super(injectedAccount);
    this.#injector = injector;
  }

  public override getSigner(): SdkSigner {
    if (!this.#signer) {
      this.#signer = createSigner(this.instance, this.#injector);
    }
    return this.#signer;
  }
}
