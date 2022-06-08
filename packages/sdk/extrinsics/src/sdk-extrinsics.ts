import { Observable, Subscriber } from 'rxjs';
import { ExtrinsicEra, SignerPayload } from '@polkadot/types/interfaces';
import {
  ISubmittableResult,
  SignatureOptions,
} from '@polkadot/types/types/extrinsic';
import { HexString } from '@polkadot/util/types';
import { objectSpread } from '@polkadot/util';
import { Sdk } from '@unique-nft/sdk';
import {
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
  Fee,
  ExtrinsicResultCallback,
} from '@unique-nft/sdk/types';
import { formatBalance } from '@unique-nft/sdk/utils';
import {
  signerPayloadToUnsignedTxPayload,
  verifyTxSignatureOrThrow,
} from './tx-utils';

import {
  buildUnsignedSubmittable,
  buildSignedSubmittable,
} from './submittable-utils';

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

    const { method, version } = buildUnsignedSubmittable(
      this.sdk.api,
      buildArgs,
    );

    const signerPayload = this.sdk.api.registry.createTypeUnsafe<SignerPayload>(
      'SignerPayload',
      [
        objectSpread({}, signatureOptions, {
          address,
          blockNumber: header?.number || 0,
          method,
          version,
        }),
      ],
    );

    return signerPayloadToUnsignedTxPayload(this.sdk.api, signerPayload);
  }

  async getFee(buildArgs: TxBuildArguments): Promise<Fee> {
    const submittable = buildUnsignedSubmittable(this.sdk.api, buildArgs);

    const { partialFee } = await submittable.paymentInfo(buildArgs.address);

    return formatBalance(this.sdk.api, partialFee);
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

  async submit(
    args: SubmitTxArguments,
    callback?: ExtrinsicResultCallback,
  ): Promise<SubmitResult> {
    try {
      const submittable = buildSignedSubmittable(this.sdk.api, args);

      if (!callback) {
        const hash = await submittable.send();

        return { hash: hash.toHex() };
      }

      const unsubscribe = await submittable.send((result) => {
        if (result.isCompleted) unsubscribe();

        callback(result);
      });

      return { hash: submittable.hash.toHex() };
    } catch (error) {
      const errorMessage =
        error && error instanceof Error ? error.message : undefined;
      throw new SubmitExtrinsicError(errorMessage);
    }
  }

  submitWaitCompleted(args: SubmitTxArguments): Promise<ISubmittableResult> {
    return new Promise(async (resolve) => {
      const callback = (result: ISubmittableResult) => {
        if (result.isCompleted) resolve(result);
      };

      await this.submit(args, callback);
    });
  }

  async submitAndObserve(
    args: SubmitTxArguments,
  ): Promise<Observable<ISubmittableResult>> {
    const submittable = buildSignedSubmittable(this.sdk.api, args);

    let resultObserver: Subscriber<ISubmittableResult>;

    const result$ = new Observable<ISubmittableResult>((observer) => {
      resultObserver = observer;
    });

    const stopWatching = await submittable.send(
      (nextTxResult: ISubmittableResult) => {
        if (nextTxResult.isError || nextTxResult.dispatchError) {
          resultObserver.error(nextTxResult);
        } else {
          resultObserver.next(nextTxResult);
        }

        if (nextTxResult.isCompleted) {
          stopWatching();
          resultObserver.complete();
        }
      },
    );

    return result$;
  }
}
