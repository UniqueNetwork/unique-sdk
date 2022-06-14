import { ApiPromise } from '@polkadot/api';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { DispatchError } from '@polkadot/types/interfaces/system';
import { ExtrinsicResultResponse } from '../types/extrinsic-result-response';

const getDispatchErrorMessage = (
  api: ApiPromise,
  dispatchError: DispatchError,
): string => {
  if (dispatchError.isModule) {
    const decoded = api.registry.findMetaError(dispatchError.asModule.toU8a());

    const { docs, name, section } = decoded;

    return `${section}.${name}: ${docs.join(' ')}`;
  }

  return dispatchError.toString();
};

const getResultError = (
  api: ApiPromise,
  result: ISubmittableResult,
): Pick<ExtrinsicResultResponse, 'isError' | 'errorMessage'> => {
  const { dispatchError, internalError } = result;

  if (dispatchError) {
    return {
      isError: true,
      errorMessage: getDispatchErrorMessage(api, dispatchError),
    };
  }

  if (internalError) {
    return {
      isError: true,
      errorMessage: `${internalError.name} ${internalError.message}`,
    };
  }

  return { isError: result.isError };
};

const getResultBlock = (
  result: ISubmittableResult,
): Pick<ExtrinsicResultResponse, 'blockHash' | 'blockIndex'> => {
  if (result.isFinalized) {
    return {
      blockIndex: result.txIndex,
      blockHash: result.status.asFinalized.hash.toHex(),
    };
  } if (result.isInBlock) {
    return {
      blockIndex: result.txIndex,
      blockHash: result.status.asInBlock.hash.toHex(),
    };
  }

  return {};
};

const getResultEvents = ({
  events = [],
}: ISubmittableResult): Pick<ExtrinsicResultResponse, 'events'> => ({
    events: events.map((event) => ({
      section: event.event.section,
      method: event.event.method,
      data: event.event.data.toHuman(),
    })),
  });

export const serializeResult = (
  api: ApiPromise,
  result: ISubmittableResult,
): ExtrinsicResultResponse => ({
  status: result.status.type,
  isCompleted: result.isCompleted,
  ...getResultEvents(result),
  ...getResultBlock(result),
  ...getResultError(api, result),
});
