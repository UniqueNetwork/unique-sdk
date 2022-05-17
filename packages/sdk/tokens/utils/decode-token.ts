import { u8aToString } from '@polkadot/util';
import { decodeConstData, getTokenUrl } from '@unique-nft/sdk/utils';

import type { PalletNonfungibleItemData } from '@unique-nft/types';
import type {
  CollectionInfo,
  SdkOptions,
  TokenInfo,
} from '@unique-nft/sdk/types';

type IpfsOptions = Pick<SdkOptions, 'ipfsGatewayUrl'>;

export const decodeToken = (
  collection: CollectionInfo,
  tokenId: number,
  tokenData: PalletNonfungibleItemData,
  options: IpfsOptions,
): TokenInfo => {
  const decodedConstData = collection.constOnChainSchema
    ? decodeConstData(
        tokenData.constData.toU8a(true),
        collection.constOnChainSchema,
      )
    : undefined;

  const tokenUrl = getTokenUrl({
    collection,
    decodedConstData,
    tokenId,
    ipfsGatewayUrl: options.ipfsGatewayUrl,
  });

  return {
    id: tokenId,
    collectionId: collection.id,
    url: tokenUrl,
    constData: decodedConstData || null,
    variableData: u8aToString(tokenData.variableData.toU8a(true)) || null,
    owner: tokenData.owner.value.toString(),
  };
};
