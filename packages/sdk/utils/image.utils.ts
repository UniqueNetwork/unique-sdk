import { CollectionSchemaVersion } from '@unique-nft/sdk/types';

const getImageUrlForImageUrlSchema = ({
  tokenId,
  offchainSchema,
}: {
  tokenId: number;
  offchainSchema?: string;
}): string | null => {
  const urlTemplate = offchainSchema;

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
  schemaVersion,
  offchainSchema,
  tokenId,
  decodedConstData,
}: {
  schemaVersion?: string;
  offchainSchema?: string;
  tokenId: number;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  decodedConstData?: Record<string, any>;
}): string | null => {
  if (schemaVersion === CollectionSchemaVersion.ImageURL) {
    return getImageUrlForImageUrlSchema({ offchainSchema, tokenId });
  }
  if (schemaVersion === CollectionSchemaVersion.Unique && decodedConstData) {
    return getImageUrlForUniqueSchema({ decodedConstData });
  }

  return null;
};
