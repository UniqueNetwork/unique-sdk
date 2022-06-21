import '@unique-nft/unique-mainnet-types/augment-api';
import { unique } from '@unique-nft/unique-mainnet-types/definitions';

import { ApiPromise, WsProvider } from '@polkadot/api';

import { SdkOptions, SdkSigner, ChainProperties } from '@unique-nft/sdk/types';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

export class Sdk {
  readonly isReady: Promise<boolean>;

  readonly api: ApiPromise;

  signer?: SdkSigner;

  static async create(options: SdkOptions): Promise<Sdk> {
    const sdk = new Sdk(options);
    await sdk.isReady;

    return sdk;
  }

  constructor(public readonly options: SdkOptions) {
    const provider = new WsProvider(this.options.chainWsUrl);

    this.api = new ApiPromise({
      provider,
      rpc: {
        unique: unique.rpc,
      },
    });

    this.isReady = this.api.isReady.then(() => true);

    this.signer = this.options.signer;
  }

  chainProperties(): ChainProperties {
    return {
      SS58Prefix: this.api.registry.chainSS58 || 0,
      token: this.api.registry.chainTokens[0],
      decimals: this.api.registry.chainDecimals[0],
      wsUrl: this.options.chainWsUrl,
      genesisHash: this.api.genesisHash.toHex(), // todo hex?
    };
  }

  transformAddress(address: string): string {
    return encodeAddress(
      decodeAddress(address),
      this.chainProperties().SS58Prefix,
    );
  }
}
