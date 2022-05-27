import { HexString } from '@polkadot/util/types';
import { SdkSigner, SignatureType, SignResult } from '@unique-nft/sdk/types';
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

  public async sign(payload: HexString): Promise<SignResult> {
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
    const signRaw = injector?.signer?.signRaw;
    if (signRaw) {
      const { signature } = await signRaw({
        address: account.address,
        data: payload,
        type: 'bytes',
      });
      return {
        signature,
        signatureType: SignatureType.Sr25519,
      };
    }

    throw new BadSignatureError('Fail sign message');
  }
}
