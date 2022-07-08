import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';

import { GetCollectionStatsResult } from './types';

async function collectionStatsFn(this: Sdk): Promise<GetCollectionStatsResult> {
  const collectionStats = await this.api.rpc.unique.collectionStats();

  // todo: correct decode

  return collectionStats.toJSON() as GetCollectionStatsResult;
}

export const collectionStats: QueryMethod<void, GetCollectionStatsResult> =
  collectionStatsFn;
