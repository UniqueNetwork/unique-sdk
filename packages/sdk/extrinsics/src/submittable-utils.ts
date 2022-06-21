import {
  SubmitTxArguments,
  TxBuildArguments,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { BuildExtrinsicError } from '@unique-nft/sdk/errors';
import { ApiPromise } from '@polkadot/api';
import {
  isSubmitTxArguments,
  verifyTxSignatureOrThrow,
  isUnsignedTxPayload,
} from './tx-utils';

export const buildSubmittableFromArgs = (
  api: ApiPromise,
  buildArgs: TxBuildArguments,
): SubmittableExtrinsic => {
  const { section, method, args } = buildArgs;

  try {
    return api.tx[section][method](...args);
  } catch (error) {
    throw BuildExtrinsicError.wrapError(error, { section, method, args });
  }
};

export const buildUnsignedSubmittable = (
  api: ApiPromise,
  unsignedTxPayload: UnsignedTxPayload,
): SubmittableExtrinsic => {
  const { signerPayloadJSON, signerPayloadHex } = unsignedTxPayload;

  try {
    return api.tx(signerPayloadHex);
  } catch (error) {
    throw BuildExtrinsicError.wrapError(error, signerPayloadJSON);
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

export const buildSubmittable = (
  api: ApiPromise,
  arg: TxBuildArguments | UnsignedTxPayload | SubmitTxArguments,
): SubmittableExtrinsic => {
  if (isSubmitTxArguments(arg)) {
    return buildSignedSubmittable(api, arg);
  }

  if (isUnsignedTxPayload(arg)) {
    return buildUnsignedSubmittable(api, arg);
  }

  return buildSubmittableFromArgs(api, arg);
};

export const getAddress = (
  arg: TxBuildArguments | UnsignedTxPayload | SubmitTxArguments,
): string => {
  if (isSubmitTxArguments(arg)) {
    return arg.signerPayloadJSON.address;
  }

  if (isUnsignedTxPayload(arg)) {
    return arg.signerPayloadJSON.address;
  }

  return arg.address;
};
