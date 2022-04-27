import '@unique-nft/types/augment-api-rpc';

import { unique } from '@unique-nft/types/definitions';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { SignerPayload, ExtrinsicEra } from '@polkadot/types/interfaces';
import { SignatureOptions } from '@polkadot/types/types/extrinsic';
import { formatBalance, objectSpread } from '@polkadot/util';
import {
  SdkOptions,
  ChainProperties,
  Balance,
  GetBalanceArgs,
  UnsignedTxPayload,
  TxBuildArgs,
  SubmitTxArgs,
  SubmitResult,
} from './types';
// todo @unique-nft/sdk/helpers (utils?)
import { getSignerPayloadHex, verifyTxSignature } from './helpers';

export class Sdk {
  private readonly api: ApiPromise;
  readonly isReady: Promise<boolean>;

  constructor(private readonly options: SdkOptions) {
    const provider = new WsProvider(this.options.chainWsUrl);

    this.api = new ApiPromise({
      provider,
      rpc: {
        unique: unique.rpc,
      },
    });
    // todo EventEmitter? sdk.on('connect') ..
    this.isReady = this.api.isReadyOrError
      .catch(() => {
        // ignore
      })
      .then(() => {
        console.log(`connected to ${this.options.chainWsUrl}`);

        return true;
      });
  }

  // todo any address (opal, quartz, unique) to current prefix
  async getBalance({ address }: GetBalanceArgs): Promise<Balance> {
    // todo `get`: this.api[section][method]?
    // todo getBalance(address) { this.get('balances', 'all', address);
    const { availableBalance } = await this.api.derive.balances.all(address);

    return {
      amount: availableBalance.toBigInt().toString(),
      formatted: formatBalance(availableBalance, {
        decimals: this.api.registry.chainDecimals[0],
        withUnit: this.api.registry.chainTokens[0],
      }),
      // todo formatted -> formatted, withUnit, as number?
    };
  }

  /**
   * just sample method using "unique" pallet
   * @param collectionId
   */
  async getCollectionExists(collectionId: string): Promise<boolean> {
    const collectionInfo = await this.api.rpc.unique.collectionById(
      collectionId,
    );

    return !collectionInfo.isEmpty;
  }

  async getChainProperties(): Promise<ChainProperties> {
    return {
      SS58Prefix: this.api.registry.chainSS58 || 0,
      token: this.api.registry.chainTokens[0],
      decimals: this.api.registry.chainDecimals[0],
      wsUrl: this.options.chainWsUrl,
    };
  }

  async buildTx(buildArgs: TxBuildArgs): Promise<UnsignedTxPayload> {
    const { address, section, method, args } = buildArgs;

    const signingInfo = await this.api.derive.tx.signingInfo(
      address,
      undefined,
      buildArgs.isImmortal ? 0 : undefined,
    );

    const { nonce, header, mortalLength } = signingInfo;

    // todo 'ExtrinsicEra' -> enum ExtrinsicTypes {} ?
    const era = !buildArgs.isImmortal
      ? this.api.registry.createTypeUnsafe<ExtrinsicEra>('ExtrinsicEra', [
          {
            current: header!.number,
            period: buildArgs.era || mortalLength,
          },
        ])
      : undefined;

    const blockHash = buildArgs.isImmortal
      ? this.api.genesisHash
      : header!.hash;

    const {
      genesisHash,
      runtimeVersion,
      registry: { signedExtensions },
    } = this.api;

    const signatureOptions: SignatureOptions = {
      nonce,
      blockHash,
      era,
      genesisHash,
      runtimeVersion,
      signedExtensions,
    };

    const tx = this.api.tx[section][method](...args);

    const signerPayload = this.api.registry.createTypeUnsafe<SignerPayload>(
      'SignerPayload',
      [
        objectSpread({}, signatureOptions, {
          address,
          blockNumber: header?.number || 0,
          method: tx.method,
          version: tx.version,
        }),
      ],
    );

    const signerPayloadJSON = signerPayload.toPayload();
    const signerPayloadRaw = signerPayload.toRaw();
    const signerPayloadHex = getSignerPayloadHex(this.api, signerPayloadRaw);

    return {
      signerPayloadJSON,
      signerPayloadRaw,
      signerPayloadHex,
    };
  }

  async submitTx(args: SubmitTxArgs): Promise<SubmitResult> {
    const { signerPayloadJSON, signature, signatureType } = args;
    const { method, version, address } = signerPayloadJSON;

    // todo 'ExtrinsicSignature' -> enum ExtrinsicTypes {} ?
    const signatureWithType = signatureType
      ? this.api.registry
          .createType('ExtrinsicSignature', { [signatureType]: signature })
          .toHex()
      : signature;

    verifyTxSignature(this.api, signerPayloadJSON, signature);

    // todo 'Extrinsic' -> enum ExtrinsicTypes {} ?
    const extrinsic = this.api.registry.createType('Extrinsic', {
      method,
      version,
    });

    extrinsic.addSignature(address, signatureWithType, signerPayloadJSON);

    const hash = await this.api.rpc.author.submitExtrinsic(extrinsic);

    return { hash: hash.toHex() };
  }
}
