import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';

import { CollectionStatsResult } from './types';

async function collectionStatsFn(this: Sdk): Promise<CollectionStatsResult> {
  const collectionStats = await this.api.rpc.unique.collectionStats();

  const statsJson = collectionStats.toJSON() as {
    created: number;
    destroyed: number;
    alive: number;
  };

  return statsJson;
}

export const collectionStats: QueryMethod<void, CollectionStatsResult> =
  collectionStatsFn;
