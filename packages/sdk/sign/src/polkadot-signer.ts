import { HexString } from '@polkadot/util/types';
import { SdkSigner } from '@unique-nft/sdk/types';
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { BadSignatureError } from '@unique-nft/sdk/errors';
import { PolkadotSignerOptions } from './types';

export class PolkadotSigner implements SdkSigner {
  constructor(private readonly options: PolkadotSignerOptions) {}

  private static async getAccounts(): Promise<InjectedAccountWithMeta[]> {
    const extensions = await web3Enable('Unique app');
    if (extensions.length === 0) {
      throw new BadSignatureError('Polkadot extension not installed');
    }
    return web3Accounts();
  }

  public async sign(payload: HexString): Promise<HexString> {
    const allAccounts = await PolkadotSigner.getAccounts();
    let account: InjectedAccountWithMeta;
    switch (allAccounts.length) {
      case 0:
        throw new BadSignatureError('Polkadot account not found');
      case 1:
        account = allAccounts[0];
        break;
      default:
        account = await this.options.choosePolkadotAccount(allAccounts);
        break;
    }
    const injector = await web3FromSource(account.meta.source);
    const signRaw = injector?.signer?.signRaw;
    if (!!signRaw) {
      const { signature } = await signRaw({
        address: account.address,
        data: payload,
        type: 'bytes',
      });
      return signature;
    } else {
      throw new BadSignatureError('Fail sign message');
    }
  }
}
