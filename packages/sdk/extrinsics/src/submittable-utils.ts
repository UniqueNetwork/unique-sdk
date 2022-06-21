import { SubmitTxArguments, TxBuildArguments } from '@unique-nft/sdk/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { BuildExtrinsicError } from '@unique-nft/sdk/errors';
import { ApiPromise } from '@polkadot/api';
import { IEventRecord, ISubmittableResult } from '@polkadot/types/types';
import { Codec } from '@polkadot/types-codec/types';
import { verifyTxSignatureOrThrow } from './tx-utils';

export const buildUnsignedSubmittable = (
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

export function findEventRecord<T extends Codec[]>(
  result: ISubmittableResult,
  section: string,
  method: string,
): IEventRecord<T> | undefined {
  const eventRecord = result.findRecord(section, method);

  // todo - bad hack, but api.events.section.method.is does not work
  return eventRecord ? (eventRecord as unknown as IEventRecord<T>) : undefined;
}
