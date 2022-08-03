import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { CollectionIdArguments } from '../../types';
import { CollectionTokensResult } from './types';

async function query(
  this: Sdk,
  { collectionId }: CollectionIdArguments,
): Promise<CollectionTokensResult | null> {
  const result = await this.api.rpc.unique.collectionTokens(collectionId);
  return result
    ? ({
        ids: result,
      } as unknown as CollectionTokensResult)
    : null;
}

export const collectionTokensQuery: QueryMethod<
  CollectionIdArguments,
  CollectionTokensResult
> = query;
