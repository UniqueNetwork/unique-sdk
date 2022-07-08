import { decodeConstData, getTokenUrl } from '@unique-nft/sdk/utils';

import type { UpDataStructsTokenData } from '@unique-nft/unique-mainnet-types';
import type { TokenInfo, TokenProperties } from '@unique-nft/sdk/types';
import { TokenPropertiesKeys } from '@unique-nft/sdk/types';
import { CollectionInfo } from '../methods/collection-by-id/types';

export const decodeToken = (
  collection: CollectionInfo,
  tokenId: number,
  tokenData: UpDataStructsTokenData,
): TokenInfo => {
  let constData: Uint8Array | null = null;
  tokenData.properties.forEach((prop) => {
    switch (prop.key.toHuman()) {
      case TokenPropertiesKeys.constData:
        constData = prop.value.toU8a(true);
        break;
      default:
        break;
    }
  });

  const decodedConstData =
    collection.properties.constOnChainSchema && constData
      ? decodeConstData(constData, collection.properties.constOnChainSchema)
      : undefined;
  const tokenProperties: TokenProperties = {
    constData: decodedConstData,
  };

  const tokenUrl = getTokenUrl({
    schemaVersion: collection.properties.schemaVersion,
    offchainSchema: collection.properties.offchainSchema,
    decodedConstData,
    tokenId,
  });

  const ownerJson = tokenData.owner.value.toHuman() as any;
  return {
    id: tokenId,
    collectionId: collection.id,
    url: tokenUrl,
    owner: ownerJson ? ownerJson.Substrate || ownerJson.Ethereum : null,
    properties: tokenProperties,
  };
};
