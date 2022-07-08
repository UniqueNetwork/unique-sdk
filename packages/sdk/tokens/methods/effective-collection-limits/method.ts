import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';

import { CollectionIdArguments, GetCollectionLimitsResult } from './types';
import { decodeCollectionLimits } from '../set-collection-limits/utils';

async function effectiveCollectionLimitsFn(
  this: Sdk,
  args: CollectionIdArguments,
): Promise<GetCollectionLimitsResult | null> {
  const limitsOption = await this.api.rpc.unique.effectiveCollectionLimits(
    args.collectionId,
  );

  const limits = limitsOption.unwrapOr(null);
  if (!limits) return null;

  const decoded = decodeCollectionLimits(limits);

  return {
    limits: decoded,
    collectionId: args.collectionId,
  };
}

export const effectiveCollectionLimits: QueryMethod<
  CollectionIdArguments,
  GetCollectionLimitsResult
> = effectiveCollectionLimitsFn;
