import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { SchemaTools } from '@unique-nft/api';
import { Option } from '@polkadot/types-codec';
import { PalletEvmAccountBasicCrossAccountIdRepr } from '@unique-nft/unique-mainnet-types';

import { TokenIdArguments } from '../../types/shared';
import { UniqueTokenDecoded, OwnerAddress } from './types';
import { tryParseParent } from '../token-parent/method';

function transformOwner(
  ownerOption: Option<PalletEvmAccountBasicCrossAccountIdRepr>,
): OwnerAddress {
  const owner = ownerOption.unwrapOr(null);

  if (!owner) return { Substrate: '' };

  return owner.isSubstrate
    ? { Substrate: owner.asSubstrate.toString() }
    : { Ethereum: owner.asEthereum.toString() };
}

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

  if (uniqueCollection.schema) {
    const tokenDecodingResult = await SchemaTools.decode.token(
      collectionId,
      tokenId,
      tokenData,
      uniqueCollection.schema,
    );

    if (tokenDecodingResult.result) return tokenDecodingResult.result;
  }

  const nestedOwner = tryParseParent(tokenData.owner) || undefined;

  const nestingParentToken = nestedOwner
    ? { collectionId: nestedOwner.collectionId, tokenId: nestedOwner.tokenId }
    : undefined;

  return {
    tokenId,
    collectionId,
    owner: transformOwner(tokenData.owner),
    nestingParentToken,
    attributes: {},
    image: {
      ipfsCid: '',
      fullUrl: '',
    },
  };
}

export const tokenById: QueryMethod<TokenIdArguments, UniqueTokenDecoded> =
  tokenByIdFn;
