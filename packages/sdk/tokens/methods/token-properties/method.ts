import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { bytesToString } from '@unique-nft/sdk/utils';
import { TokenPropertiesArguments, TokenPropertiesResult } from './types';

async function query(
  this: Sdk,
  args: TokenPropertiesArguments,
): Promise<TokenPropertiesResult> {
  const properties = args.propertyKeys
    ? await this.api.rpc.unique.tokenProperties(
        args.collectionId,
        args.tokenId,
        args.propertyKeys,
      )
    : await this.api.rpc.unique.tokenProperties(
        args.collectionId,
        args.tokenId,
      );

  return properties.map((property) => ({
    key: bytesToString(property.key),
    value: bytesToString(property.value),
  }));
}

export const tokenPropertiesQuery: QueryMethod<
  TokenPropertiesArguments,
  TokenPropertiesResult
> = query;
