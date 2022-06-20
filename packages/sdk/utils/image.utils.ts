import { CollectionInfo, CollectionSchemaVersion } from '@unique-nft/sdk/types';

const getImageUrlForImageUrlSchema = ({
  tokenId,
  collection,
}: {
  tokenId: number;
  collection: CollectionInfo;
}): string | null => {
  const urlTemplate = collection.properties.offchainSchema;

  if (urlTemplate && urlTemplate.includes('{id}')) {
    return urlTemplate.replace('{id}', tokenId.toString());
  }

  return null;
};

const getImageUrlForUniqueSchema = ({
  decodedConstData = {},
}: {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  decodedConstData: Record<string, any>;
}): string | null => {
  const { ipfsJson } = decodedConstData;

  if (!ipfsJson || typeof ipfsJson !== 'string') return null;

  try {
    const { ipfs: ipfsCid } = JSON.parse(ipfsJson) as {
      ipfs?: string;
    };

    if (ipfsCid) {
      return ipfsCid;
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
}: {
  collection: CollectionInfo;
  tokenId: number;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  decodedConstData?: Record<string, any>;
}): string | null => {
  if (
    collection.properties.schemaVersion === CollectionSchemaVersion.ImageURL
  ) {
    return getImageUrlForImageUrlSchema({ collection, tokenId });
  }
  if (
    collection.properties.schemaVersion === CollectionSchemaVersion.Unique &&
    decodedConstData
  ) {
    return getImageUrlForUniqueSchema({ decodedConstData });
  }

  return null;
};
