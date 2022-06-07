import { SubmitTxArguments, TxBuildArguments } from '@unique-nft/sdk/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { BuildExtrinsicError } from '@unique-nft/sdk/errors';
import { ApiPromise } from '@polkadot/api';
import { verifyTxSignatureOrThrow } from '@unique-nft/sdk/extrinsics';

export const buildUnsignedSubmittable = (
  api: ApiPromise,
  buildArgs: TxBuildArguments,
): SubmittableExtrinsic => {
  const { section, method, args } = buildArgs;

  try {
    return api.tx[section][method](...args);
  } catch (error) {
    const errorMessage =
      error && error instanceof Error ? error.message : undefined;
    throw new BuildExtrinsicError(errorMessage);
  }
};

export const buildSignedSubmittable = (
  api: ApiPromise,
  args: SubmitTxArguments,
): SubmittableExtrinsic => {
  const { signerPayloadJSON, signature } = args;
  const { method, version, address } = signerPayloadJSON;

  verifyTxSignatureOrThrow(api, signerPayloadJSON, signature);

  // todo 'Extrinsic' -> enum ExtrinsicTypes {} ?
  const extrinsic = api.registry.createType('Extrinsic', {
    method,
    version,
  });

  const submittable = api.tx(extrinsic);

  submittable.addSignature(address, signature, signerPayloadJSON);

  return submittable;
};
