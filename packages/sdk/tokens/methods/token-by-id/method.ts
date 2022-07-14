import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { SchemaTools, UniqueTokenDecoded } from '@unique-nft/api';
import { SdkError } from '@unique-nft/sdk/errors';

import { TokenIdArguments } from '../../types';
import { AttributesTransformer } from '../create-collection-ex-new/utils';

async function tokenByIdFn(
  this: Sdk,
  args: TokenIdArguments,
): Promise<UniqueTokenDecoded | null> {
  const { collectionId, tokenId } = args;

  const uniqueCollection = await this.collections.get_new({ collectionId });
  if (!uniqueCollection) return null;

  const exists = await this.api.rpc.unique.tokenExists(collectionId, tokenId);
  if (!exists.toHuman()) return null;

  const tokenData = await this.api.rpc.unique.tokenData(collectionId, tokenId);
  if (!tokenData) return null;

  const tokenDecodingResult = await SchemaTools.decode.token(
    collectionId,
    tokenId,
    tokenData,
    AttributesTransformer.toOriginal(uniqueCollection.schema),
  );

  if (!tokenDecodingResult.isValid)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    throw SdkError.wrapError(tokenDecodingResult.validationError);

  return tokenDecodingResult.decoded;
}

export const tokenById: QueryMethod<TokenIdArguments, UniqueTokenDecoded> =
  tokenByIdFn;
