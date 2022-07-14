import { SdkSigner, UnsignedTxPayload } from '@unique-nft/accounts/sign';
import { Keyring } from '@polkadot/keyring';
import { KeyringOptions, KeyringPair } from '@polkadot/keyring/types';
import { SignatureType, SignResult } from '@unique-nft/accounts';
import { u8aToHex } from '@polkadot/util';

export abstract class Account<T = unknown> {
  abstract getSigner(): SdkSigner;
  protected constructor(
    public instance: T,
  ) {
  }
}

export class KeyringAccount extends Account<KeyringPair> {

  public override getSigner(): SdkSigner {
    return {
      sign: async (unsignedTxPayload: UnsignedTxPayload): Promise<SignResult> => {
        const signature = await this.instance.sign(unsignedTxPayload.signerPayloadHex);
        return {
          signature: u8aToHex(signature),
          signatureType: this.instance.type as SignatureType,
        }
      },
    }
  }

}

export abstract class Provider<I = unknown, A = unknown> {
  abstract instance: I;

  abstract getAccounts(): Account<A>[];
}

export class KeyringProvider extends Provider<Keyring> {

  instance = new Keyring(this.options);

  constructor(
    private options?: KeyringOptions,
  ) {
    super();
  }

  public override getAccounts(): Account[] {
    return this.instance.pairs.map((p) => {
      return new KeyringAccount(p);
    });
  }
}



export class Accounts {
  private providers = new Map<typeof Provider, Provider>();

  constructor({
    providers,
              }: {
    providers: Provider[],
  }) {
  }

  getProvider(ProviderClass: typeof Provider): Provider | undefined {
    return this.providers.get(ProviderClass);
  }

  getAccounts(): Account[] {
    const accounts = [];
    for(const provider in this.providers.values()) {
      accounts.push(... provider.getAccounts());
    }
    return accounts;
  }

  first(): Account | undefined {
    return this.getAccounts().find(a => !!a);
  }
}

const accounts = new Accounts({
  providers: [
    new KeyringProvider(),
  ],
});

const account = accounts.first();

const signer = account?.getSigner();
