import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';

import { GetStatsResult } from './types';

async function getStatsFn(this: Sdk): Promise<GetStatsResult> {
  const stats = await this.api.rpc.unique.collectionStats();

  return stats.toJSON() as {
    created: number;
    destroyed: number;
    alive: number;
  };
}

export const getStats: QueryMethod<void, GetStatsResult> = getStatsFn;
