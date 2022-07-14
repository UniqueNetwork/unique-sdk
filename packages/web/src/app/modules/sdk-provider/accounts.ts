import { SignatureType } from '@unique-nft/accounts';
import { addFeature } from '@unique-nft/sdk';
import { SdkSigner } from '@unique-nft/sdk/types';
import { KeyringProvider } from '@unique-nft/accounts/keyring';

export class AccountsModule {
  #provider: KeyringProvider;

  constructor() {
    this.#provider = new KeyringProvider({
      type: SignatureType.Sr25519,
    });
  }

  initProvider(provider: KeyringProvider) {
    this.#provider = provider;
  }

  getSigner(seed: string): SdkSigner {
    return this.#provider.addSeed(seed).getSigner();
  }
}

declare module '@unique-nft/sdk' {
  export interface Sdk {
    accounts: AccountsModule;
  }
}

addFeature('accounts', AccountsModule);
