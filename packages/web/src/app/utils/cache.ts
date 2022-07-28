import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { ApiPromise } from '@polkadot/api';
import { Balance, SubmittableDispatchError } from '@unique-nft/sdk/types';
import { serializeResult } from './submittable-result-transformer';
import { ExtrinsicResultResponse } from '../types/extrinsic-result-response';

export const getPendingResult = (fee?: Balance): ExtrinsicResultResponse => ({
  events: [],
  isCompleted: false,
  isError: false,
  status: 'pending',
  fee,
});

export const getErrorResult = (
  error: SubmittableDispatchError,
  fee?: Balance,
): ExtrinsicResultResponse => ({
  events: [],
  isCompleted: true,
  isError: true,
  status: 'Error',
  error,
  fee,
});

export const getSucceedResult = (
  api: ApiPromise,
  submittableResult: ISubmittableResult,
  parsed?: unknown,
  fee?: Balance,
): ExtrinsicResultResponse => {
  const serialized = serializeResult(api, submittableResult);

  return {
    ...serialized,
    parsed: submittableResult.isCompleted ? parsed : undefined,
    fee,
  };
};
