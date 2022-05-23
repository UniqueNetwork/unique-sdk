// eslint-disable-next-line max-classes-per-file
import { ApiPromise } from '@polkadot/api';
import { ExtrinsicEra, SignerPayload } from '@polkadot/types/interfaces';
import { SignatureOptions } from '@polkadot/types/types/extrinsic';
import { objectSpread } from '@polkadot/util';
import {
  BuildExtrinsicError,
  InvalidSignerError,
  SubmitExtrinsicError,
} from '@unique-nft/sdk/errors';
import { validate } from '@unique-nft/sdk/validation';
import {
  ISdkExtrinsics,
  SubmitResult,
  SubmitTxArgs,
  TxBuildArgs,
  UnsignedTxPayload,
  SignTxArgs,
  SignTxResult,
  SdkSigner,
} from '@unique-nft/sdk/types';
import {
  signerPayloadToUnsignedTxPayload,
  verifyTxSignatureOrThrow,
} from './tx';

interface Sdk {
  api: ApiPromise;
  signer?: SdkSigner;
}

export class SdkExtrinsics implements ISdkExtrinsics {
  constructor(readonly sdk: Sdk) {}

  async build(buildArgs: TxBuildArgs): Promise<UnsignedTxPayload> {
    const { address, section, method, args } = buildArgs;

    const signingInfo = await this.sdk.api.derive.tx.signingInfo(
      address,
      -1,
      buildArgs.isImmortal ? 0 : undefined,
    );

    const { nonce, header, mortalLength } = signingInfo;

    // todo 'ExtrinsicEra' -> enum ExtrinsicTypes {} ?
    const era = !buildArgs.isImmortal
      ? this.sdk.api.registry.createTypeUnsafe<ExtrinsicEra>('ExtrinsicEra', [
          {
            current: header?.number || 0,
            period: buildArgs.era || mortalLength,
          },
        ])
      : undefined;

    const blockHash = buildArgs.isImmortal
      ? this.sdk.api.genesisHash
      : header?.hash || this.sdk.api.genesisHash;

    const {
      genesisHash,
      runtimeVersion,
      registry: { signedExtensions },
    } = this.sdk.api;

    const signatureOptions: SignatureOptions = {
      nonce,
      blockHash,
      era,
      genesisHash,
      runtimeVersion,
      signedExtensions,
    };

    let tx;
    try {
      tx = this.sdk.api.tx[section][method](...args);
    } catch (error) {
      const errorMessage =
        error && error instanceof Error ? error.message : undefined;
      throw new BuildExtrinsicError(errorMessage);
    }

    const signerPayload = this.sdk.api.registry.createTypeUnsafe<SignerPayload>(
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

    return signerPayloadToUnsignedTxPayload(this.sdk.api, signerPayload);
  }

  async sign(
    args: SignTxArgs,
    signer: SdkSigner | undefined = this.sdk.signer,
  ): Promise<SignTxResult> {
    if (!signer) throw new InvalidSignerError();

    return signer.sign(args.signerPayloadHex);
  }

  verifySignOrThrow(args: SubmitTxArgs): void {
    verifyTxSignatureOrThrow(
      this.sdk.api,
      args.signerPayloadJSON,
      args.signature,
    );
  }

  async submit(args: SubmitTxArgs): Promise<SubmitResult> {
    await validate(args, SubmitTxArgs);
    const { signerPayloadJSON, signature, signatureType } = args;
    const { method, version, address } = signerPayloadJSON;

    // todo 'ExtrinsicSignature' -> enum ExtrinsicTypes {} ?
    const signatureWithType = this.sdk.api.registry
      .createType('ExtrinsicSignature', { [signatureType]: signature })
      .toHex();

    verifyTxSignatureOrThrow(this.sdk.api, signerPayloadJSON, signature);

    // todo 'Extrinsic' -> enum ExtrinsicTypes {} ?
    const extrinsic = this.sdk.api.registry.createType('Extrinsic', {
      method,
      version,
    });

    extrinsic.addSignature(address, signatureWithType, signerPayloadJSON);

    try {
      const hash = await this.sdk.api.rpc.author.submitExtrinsic(extrinsic);
      return { hash: hash.toHex() };
    } catch (error) {
      const errorMessage =
        error && error instanceof Error ? error.message : undefined;
      throw new SubmitExtrinsicError(errorMessage);
    }
  }
}
