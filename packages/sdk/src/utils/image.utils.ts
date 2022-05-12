import { CollectionInfo, CollectionSchemaVersion } from '../types';

const getImageUrlForImageUrlSchema = ({
  tokenId,
  collection,
}: {
  tokenId: number;
  collection: CollectionInfo;
}): string | null => {
  const urlTemplate = collection.offchainSchema;

  if (urlTemplate && urlTemplate.includes('{id}')) {
    return urlTemplate.replace('{id}', tokenId.toString());
  }

  return null;
};

const getImageUrlForUniqueSchema = ({
  decodedConstData = {},
  ipfsGatewayUrl,
}: {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  decodedConstData: Record<string, any>;
  ipfsGatewayUrl: string;
}): string | null => {
  const { ipfsJson } = decodedConstData;

  if (!ipfsJson || typeof ipfsJson !== 'string') return null;

  try {
    const { ipfs: ipfsCid } = JSON.parse(ipfsJson) as {
      ipfs?: string;
    };

    if (ipfsCid) {
      return ipfsGatewayUrl + ipfsCid;
    }
  } catch (e) {
    // do nothing
  }

  return null;
};

export const getTokenUrl = ({
  collection,
  tokenId,
  decodedConstData,
  ipfsGatewayUrl,
}: {
  collection: CollectionInfo;
  tokenId: number;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  decodedConstData?: Record<string, any>;
  ipfsGatewayUrl: string;
}): string | null => {
  if (collection.schemaVersion === CollectionSchemaVersion.ImageURL) {
    return getImageUrlForImageUrlSchema({ collection, tokenId });
  }
  if (
    collection.schemaVersion === CollectionSchemaVersion.Unique &&
    decodedConstData
  ) {
    return getImageUrlForUniqueSchema({ decodedConstData, ipfsGatewayUrl });
  }

  return null;
};
