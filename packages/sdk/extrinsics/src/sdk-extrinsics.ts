import { ApiPromise } from '@polkadot/api';
import { ExtrinsicEra, SignerPayload } from '@polkadot/types/interfaces';
import { SignatureOptions } from '@polkadot/types/types/extrinsic';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { HexString } from '@polkadot/util/types';
import { objectSpread } from '@polkadot/util';
import {
  BuildExtrinsicError,
  InvalidSignerError,
  SubmitExtrinsicError,
} from '@unique-nft/sdk/errors';
import {
  ISdkExtrinsics,
  SubmitResult,
  SubmitTxArguments,
  TxBuildArguments,
  UnsignedTxPayload,
  SignTxResult,
  SdkSigner,
  SignatureType,
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

  async build(buildArgs: TxBuildArguments): Promise<UnsignedTxPayload> {
    const { address } = buildArgs;

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

    const tx = this.buildSubmittable(buildArgs);

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

    const runtimeDispatchInfo = await tx.paymentInfo(address);

    return signerPayloadToUnsignedTxPayload(
      this.sdk.api,
      signerPayload,
      runtimeDispatchInfo,
    );
  }

  private buildSubmittable(buildArgs: TxBuildArguments): SubmittableExtrinsic {
    const { section, method, args } = buildArgs;

    try {
      return this.sdk.api.tx[section][method](...args);
    } catch (error) {
      const errorMessage =
        error && error instanceof Error ? error.message : undefined;
      throw new BuildExtrinsicError(errorMessage);
    }
  }

  async sign(
    args: UnsignedTxPayload,
    signer: SdkSigner | undefined = this.sdk.signer,
  ): Promise<SignTxResult> {
    if (!signer) throw new InvalidSignerError();

    return signer.sign(args);
  }

  verifySignOrThrow(args: SubmitTxArguments): void {
    verifyTxSignatureOrThrow(
      this.sdk.api,
      args.signerPayloadJSON,
      args.signature,
    );
  }

  packSignatureType(
    signature: HexString | Uint8Array,
    signatureType: SignatureType | `${SignatureType}`,
  ): HexString {
    return this.sdk.api.registry
      .createType('ExtrinsicSignature', { [signatureType]: signature })
      .toHex();
  }

  async submit(args: SubmitTxArguments): Promise<SubmitResult> {
    const { signerPayloadJSON, signature } = args;
    const { method, version, address } = signerPayloadJSON;

    verifyTxSignatureOrThrow(this.sdk.api, signerPayloadJSON, signature);

    // todo 'Extrinsic' -> enum ExtrinsicTypes {} ?
    const extrinsic = this.sdk.api.registry.createType('Extrinsic', {
      method,
      version,
    });

    const submittable = this.sdk.api.tx(extrinsic);

    submittable.addSignature(address, signature, signerPayloadJSON);

    try {
      const hash = await submittable.send();
      return { hash: hash.toHex() };
    } catch (error) {
      const errorMessage =
        error && error instanceof Error ? error.message : undefined;
      throw new SubmitExtrinsicError(errorMessage);
    }
  }
}
