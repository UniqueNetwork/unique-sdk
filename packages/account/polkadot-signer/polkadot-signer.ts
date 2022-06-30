import {
  web3Accounts,
  web3Enable,
  web3FromSource,
  isWeb3Injected,
} from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import {
  SdkSigner,
  SignatureType,
  SignResult,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { BadSignatureError } from '@unique-nft/sdk/errors';
import { PolkadotSignerOptions } from '../src/types';

export class PolkadotSigner implements SdkSigner {
  constructor(private readonly options: PolkadotSignerOptions) {}

  private static async getAccounts(): Promise<InjectedAccountWithMeta[]> {
    if (!isWeb3Injected) {
      throw new BadSignatureError('Polkadot extension not installed');
    }

    const extensions = await web3Enable('Unique app');
    if (extensions.length === 0) {
      throw new BadSignatureError('No accounts found');
    }

    const injectedAccounts = await web3Accounts();
    if (!injectedAccounts.length) {
      throw new BadSignatureError('Polkadot account not found');
    }

    return injectedAccounts;
  }

  public async sign(unsignedTxPayload: UnsignedTxPayload): Promise<SignResult> {
    const injectedAccounts = await PolkadotSigner.getAccounts();

    let injectedAccount: InjectedAccountWithMeta;
    if (this.options.chooseAccount) {
      injectedAccount = await this.options.chooseAccount(injectedAccounts);
    } else {
      injectedAccount = injectedAccounts[0];
    }

    const injector = await web3FromSource(injectedAccount.meta.source);

    const signPayload = injector?.signer?.signPayload;
    if (!signPayload) {
      throw new BadSignatureError('Fail sign message');
    }

    const { signature } = await signPayload(
      unsignedTxPayload.signerPayloadJSON,
    );

    return {
      signature,
      signatureType: injectedAccount.type as SignatureType,
    };
  }
}
