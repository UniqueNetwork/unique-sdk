import '@unique-nft/unique-mainnet-types/augment-api';
import { unique as uniqueNetwork } from '@unique-nft/unique-mainnet-types/definitions';
import { unique as quartzNetwork } from '@unique-nft/quartz-mainnet-types/definitions';
import { unique as opalNetwork } from '@unique-nft/opal-testnet-types/definitions';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { SdkOptions, SdkSigner, ChainProperties } from '@unique-nft/sdk/types';

const rpcByPrefix: Record<number, any> = {
  7391: uniqueNetwork.rpc,
  255: quartzNetwork.rpc,
  42: opalNetwork.rpc,
};

async function getPrefix(chainWsUrl: string): Promise<number> {
  const provider = new WsProvider(chainWsUrl);

  const api = new ApiPromise({ provider });
  await api.isReady;

  const prefix = api.registry.chainSS58 || 0;

  await api.disconnect();

  return prefix;
}

export class Sdk {
  #api: ApiPromise;

  signer?: SdkSigner;

  static async create(options: SdkOptions): Promise<Sdk> {
    const sdk = new Sdk(options);
    await sdk.connect();

    return sdk;
  }

  constructor(public readonly options: SdkOptions) {}

  get api() {
    return this.#api;
  }

  async connect() {
    const prefix = await getPrefix(this.options.chainWsUrl);
    const provider = new WsProvider(this.options.chainWsUrl);

    if (!rpcByPrefix[prefix]) {
      throw new Error(`Invalid prefix "${prefix}"`);
    }

    this.#api = new ApiPromise({
      provider,
      rpc: {
        unique: rpcByPrefix[prefix],
      },
    });

    await this.api.isReady;

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
}
