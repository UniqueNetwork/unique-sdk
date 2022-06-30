import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { TopmostTokenOwnerArguments, TopmostTokenOwnerResult } from './types';

async function topmostTokenOwner(
  this: Sdk,
  args: TopmostTokenOwnerArguments,
): Promise<TopmostTokenOwnerResult | null> {
  const topmostTokenOwnerOption = args.blockHashAt
    ? await this.api.rpc.unique.topmostTokenOwner(
        args.collectionId,
        args.tokenId,
        args.blockHashAt,
      )
    : await this.api.rpc.unique.topmostTokenOwner(
        args.collectionId,
        args.tokenId,
      );

  const result = topmostTokenOwnerOption.unwrapOr(null);

  if (result === null) return null;

  if (!result.isSubstrate) return null;

  return result.asSubstrate.toString();
}

export const topmostTokenOwnerQuery: QueryMethod<
  TopmostTokenOwnerArguments,
  TopmostTokenOwnerResult
> = topmostTokenOwner;
