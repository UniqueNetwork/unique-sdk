import { filterEvents } from '@polkadot/api/util/filterEvents';
import { ApiPromise } from '@polkadot/api';
import { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';
import { IU8a } from '@polkadot/types-codec/types';

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export type ExtrinsicInBlockResult = {
  blockHash?: string;
  blockNumber?: number;
  extrinsicIndex?: number;
  events?: EventRecord[];
};

export type ExtrinsicStatusOrUnknown =
  | PropType<ExtrinsicStatus, 'type'>
  | 'unknown';

export type ExtrinsicResult = {
  extrinsicHash: string;
  extrinsicStatus: ExtrinsicStatusOrUnknown;
  shortResult: 'pending' | 'success' | 'fail';
  isSubscribed: boolean;
} & ExtrinsicInBlockResult;

export const processInBlock = async (
  api: ApiPromise,
  extrinsicHash: IU8a,
  extrinsicStatus: ExtrinsicStatus,
): Promise<ExtrinsicResult> => {
  const blockHash = extrinsicStatus.isInBlock
    ? extrinsicStatus.asInBlock
    : extrinsicStatus.asFinalized;

  const { block, events: allEvents } = await api.derive.tx.events(blockHash);

  const { events, txIndex: extrinsicIndex } = filterEvents(
    extrinsicHash,
    block,
    allEvents,
    extrinsicStatus,
  );

  return {
    extrinsicStatus: extrinsicStatus.type,
    isSubscribed: false,
    shortResult: 'success',
    extrinsicHash: extrinsicHash.toHex(),
    blockHash: blockHash.toHex(),
    blockNumber: block.block.header.number.toNumber(),
    extrinsicIndex,
    events,
  };
};

export const processPending = (
  extrinsicHash: IU8a,
  extrinsicStatus: ExtrinsicStatus,
): ExtrinsicResult => ({
    extrinsicStatus: extrinsicStatus.type,
    isSubscribed: true,
    shortResult: 'pending',
    extrinsicHash: extrinsicHash.toHex(),
  });

export const processFail = (
  extrinsicHash: IU8a,
  extrinsicStatus: ExtrinsicStatus,
): ExtrinsicResult => ({
    extrinsicStatus: extrinsicStatus.type,
    isSubscribed: false,
    shortResult: 'fail',
    extrinsicHash: extrinsicHash.toHex(),
  });

export const processDefault = (
  extrinsicHash: IU8a,
  isSubscribed: boolean,
): ExtrinsicResult => ({
    extrinsicStatus: 'unknown',
    isSubscribed,
    shortResult: 'pending',
    extrinsicHash: extrinsicHash.toHex(),
  });
