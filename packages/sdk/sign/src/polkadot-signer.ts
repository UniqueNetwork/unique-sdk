import {
  SdkSigner,
  SignResult,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { BadSignatureError } from '@unique-nft/sdk/errors';
import { PolkadotSignerOptions } from './types';

export class PolkadotSigner implements SdkSigner {
  constructor(private readonly options: PolkadotSignerOptions) {
    if (!options.extensionDApp.isWeb3Injected) {
      throw new BadSignatureError('Polkadot extension not installed');
    }
  }

  private async getAccounts(): Promise<any[]> {
    const extensions = await this.options.extensionDApp.web3Enable(
      'Unique app',
    );
    if (extensions.length === 0) {
      throw new BadSignatureError('No accounts found');
    }
    return this.options.extensionDApp.web3Accounts();
  }

  public async sign(unsignedTxPayload: UnsignedTxPayload): Promise<SignResult> {
    const allAccounts = await this.getAccounts();
    let account: any;
    switch (allAccounts.length) {
      case 0:
        throw new BadSignatureError('Polkadot account not found');
      case 1:
        [account] = allAccounts;
        break;
      default:
        account = await this.options.choosePolkadotAccount(allAccounts);
        break;
    }
    const injector = await this.options.extensionDApp.web3FromSource(
      account.meta.source,
    );
    const signPayload = injector?.signer?.signPayload;
    if (signPayload) {
      const { signature } = await signPayload(
        unsignedTxPayload.signerPayloadJSON,
      );
      return {
        signature,
        signatureType: account.type,
      };
    }

    throw new BadSignatureError('Fail sign message');
  }
}
