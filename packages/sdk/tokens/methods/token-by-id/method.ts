import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { SchemaTools } from '@unique-nft/api';

import { TokenIdArguments } from '../../types';
import { AttributesTransformer } from '../create-collection-ex-new/utils';
import { TokenDecoded } from './types';

async function tokenByIdFn(
  this: Sdk,
  args: TokenIdArguments,
): Promise<TokenDecoded | null> {
  const { collectionId, tokenId } = args;

  const uniqueCollection = await this.collections.get_new({ collectionId });
  if (!uniqueCollection) return null;

  const exists = await this.api.rpc.unique.tokenExists(collectionId, tokenId);
  if (!exists.toHuman()) return null;

  const tokenData = await this.api.rpc.unique.tokenData(collectionId, tokenId);
  if (!tokenData) return null;

  if (uniqueCollection.schema) {
    const tokenDecodingResult = await SchemaTools.decode.token(
      collectionId,
      tokenId,
      tokenData,
      AttributesTransformer.toOriginal(uniqueCollection.schema),
    );

    if (tokenDecodingResult.isValid) return tokenDecodingResult.decoded;
  }

  return {
    tokenId,
    collectionId,
    owner: tokenData.owner.toHuman() as any,
    attributes: {},
  };
}

export const tokenById: QueryMethod<TokenIdArguments, TokenDecoded> =
  tokenByIdFn;
