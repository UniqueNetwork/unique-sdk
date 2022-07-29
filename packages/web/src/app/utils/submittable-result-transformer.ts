import { ApiPromise } from '@polkadot/api';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { getDispatchError } from '@unique-nft/sdk/utils';
import { ExtrinsicResultResponse } from '../types/extrinsic-result-response';

const getResultError = (api: ApiPromise, result: ISubmittableResult) => {
  const error = getDispatchError(api, result);
  return {
    isError: !!error,
    error,
  };
};

const getResultBlock = (
  result: ISubmittableResult,
): Pick<ExtrinsicResultResponse, 'blockHash' | 'blockIndex'> => {
  if (result.isFinalized) {
    return {
      blockIndex: result.txIndex,
      blockHash: result.status.asFinalized.hash.toHex(),
    };
  }
  if (result.isInBlock) {
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
