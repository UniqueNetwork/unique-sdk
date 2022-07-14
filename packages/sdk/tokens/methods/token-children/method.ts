import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { TokenChildrenArguments, TokenChildrenResult } from './types';

async function tokenChildren(
  this: Sdk,
  args: TokenChildrenArguments,
): Promise<TokenChildrenResult | null> {
  const tokenChildrenOption = await this.api.rpc.unique.tokenChildren(
    args.collectionId,
    args.tokenId,
  );

  const children = tokenChildrenOption.toJSON() as Array<{
    token: string;
    collection: string;
  }>;

  return children.map((child) => ({
    collectionId: Number(child.collection),
    tokenId: Number(child.token),
  }));
}

export const tokenChildrenQuery: QueryMethod<
  TokenChildrenArguments,
  TokenChildrenResult
> = tokenChildren;
