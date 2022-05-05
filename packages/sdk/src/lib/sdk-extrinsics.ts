import { ExtrinsicEra, SignerPayload } from '@polkadot/types/interfaces';
import { SignatureOptions } from '@polkadot/types/types/extrinsic';
import { objectSpread } from '@polkadot/util';
import { ApiPromise } from '@polkadot/api';
import { signerPayloadToUnsignedTxPayload, verifyTxSignature } from '../utils';
import {
  ISdkExtrinsics,
  SubmitResult,
  SubmitTxArgs,
  TxBuildArgs,
  UnsignedTxPayload,
} from '../types';
import { BuildExtrinsicError, SubmitExtrinsicError } from './errors';

export class SdkExtrinsics implements ISdkExtrinsics {
  constructor(readonly api: ApiPromise) {}

  async build(buildArgs: TxBuildArgs): Promise<UnsignedTxPayload> {
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
            current: header?.number || 0,
            period: buildArgs.era || mortalLength,
          },
        ])
      : undefined;

    const blockHash = buildArgs.isImmortal
      ? this.api.genesisHash
      : header?.hash || this.api.genesisHash;

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

    let tx;
    try {
      tx = this.api.tx[section][method](...args);
    } catch (error) {
      const errorMessage =
        error && error instanceof Error ? error.message : undefined;
      throw new BuildExtrinsicError(errorMessage);
    }

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

    return signerPayloadToUnsignedTxPayload(this.api, signerPayload);
  }

  async submit(args: SubmitTxArgs): Promise<SubmitResult> {
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

    try {
      const hash = await this.api.rpc.author.submitExtrinsic(extrinsic);
      return { hash: hash.toHex() };
    } catch (error) {
      const errorMessage =
        error && error instanceof Error ? error.message : undefined;
      throw new SubmitExtrinsicError(errorMessage);
    }
  }
}
