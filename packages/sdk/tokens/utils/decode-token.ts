import { decodeConstData, getTokenUrl } from '@unique-nft/sdk/utils';

import type { UpDataStructsTokenData } from '@unique-nft/unique-mainnet-types';
import type {
  CollectionInfo,
  SdkOptions,
  TokenInfo,
  TokenProperties,
} from '@unique-nft/sdk/types';
import { TokenPropertiesKeys } from '@unique-nft/sdk/types';

type IpfsOptions = SdkOptions;

export const decodeToken = (
  collection: CollectionInfo,
  tokenId: number,
  tokenData: UpDataStructsTokenData,
  options: IpfsOptions,
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
    collection,
    decodedConstData,
    tokenId,
  });

  const ownerJson = tokenData.owner.value.toHuman() as any;
  return {
    id: tokenId,
    collectionId: collection.id,
    url: tokenUrl,
    owner: ownerJson ? ownerJson.Substrate : null,
    properties: tokenProperties,
  };
};
