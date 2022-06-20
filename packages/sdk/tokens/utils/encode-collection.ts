import type { Registry } from '@polkadot/types/types';
import {
  CollectionMode,
  CollectionProperties,
  TokenPropertiesKeys,
  TokenPropertiesPermissions,
  TokenPropertyPermissions,
  CollectionInfo,
  CollectionPermissions,
  CollectionPropertiesKeys,
} from '@unique-nft/sdk/types';
import type {
  UpDataStructsCreateCollectionData,
  UpDataStructsCollectionPermissions,
  UpDataStructsAccessMode,
  UpDataStructsNestingPermissions,
} from '@unique-nft/unique-mainnet-types/default';
import { stringToUTF16 } from '@unique-nft/sdk/utils';
import { encodeCollectionFields } from './encode-collection-fields';

type CollectionProperty = {
  key: CollectionPropertiesKeys;
  value: string;
};
const encodeCollectionProperties = (
  properties: CollectionProperties,
): CollectionProperty[] => {
  const encodedProperties: CollectionProperty[] = [];
  if (properties.schemaVersion) {
    encodedProperties.push({
      key: CollectionPropertiesKeys.schemaVersion,
      value: properties.schemaVersion,
    });
  }
  if (properties.fields) {
    const constOnChainSchema = encodeCollectionFields(properties.fields);
    encodedProperties.push({
      key: CollectionPropertiesKeys.constOnChainSchema,
      value: JSON.stringify(constOnChainSchema),
    });
  } else if (properties.constOnChainSchema) {
    encodedProperties.push({
      key: CollectionPropertiesKeys.constOnChainSchema,
      value: JSON.stringify(properties.constOnChainSchema),
    });
  }
  if (properties.variableOnChainSchema) {
    encodedProperties.push({
      key: CollectionPropertiesKeys.variableOnChainSchema,
      value: properties.variableOnChainSchema,
    });
  }
  return encodedProperties;
};

const encodeCollectionPermissions = (
  registry: Registry,
  permissions: CollectionPermissions,
): UpDataStructsCollectionPermissions =>
  registry.createType<UpDataStructsCollectionPermissions>(
    'UpDataStructsCollectionPermissions',
    {
      mintMode: permissions.mintMode,
      nesting: registry.createType<UpDataStructsNestingPermissions>(
        'UpDataStructsNestingPermissions',
        {
          tokenOwner: permissions.nesting?.tokenOwner,
          collectionAdmin: permissions.nesting?.collectionAdmin,
          permissive: permissions.nesting?.permissive,
        },
      ),
      access: registry.createType<UpDataStructsAccessMode>(
        'UpDataStructsAccessMode',
        'Normal',
      ),
    },
  );

type TokenPropertyPermissionItem = {
  key: string;
  permission: TokenPropertyPermissions;
};
const encodeTokenPropertyPermissions = (
  tokenPropertyPermissions?: TokenPropertiesPermissions,
): TokenPropertyPermissionItem[] => {
  const encodedPermissions: TokenPropertyPermissionItem[] = [];
  if (tokenPropertyPermissions?.constData) {
    encodedPermissions.push({
      key: TokenPropertiesKeys.constData,
      permission: tokenPropertyPermissions.constData,
    });
  } else {
    encodedPermissions.push({
      key: TokenPropertiesKeys.constData,
      permission: {
        tokenOwner: true,
        collectionAdmin: true,
        mutable: false,
      },
    });
  }
  return encodedPermissions;
};

export const encodeCollection = (
  registry: Registry,
  collectionInfo: Partial<CollectionInfo>,
): UpDataStructsCreateCollectionData => {
  const properties = collectionInfo.properties
    ? encodeCollectionProperties(collectionInfo.properties)
    : [];

  const permissions = collectionInfo.permissions
    ? encodeCollectionPermissions(registry, collectionInfo.permissions)
    : {};

  const tokenPropertyPermissions = encodeTokenPropertyPermissions(
    collectionInfo.tokenPropertyPermissions,
  );

  const createData = {
    mode: collectionInfo.mode || CollectionMode.Nft,
    name: collectionInfo.name ? stringToUTF16(collectionInfo.name) : undefined,
    description: collectionInfo.description
      ? stringToUTF16(collectionInfo.description)
      : undefined,
    tokenPrefix: collectionInfo.tokenPrefix
      ? stringToUTF16(collectionInfo.tokenPrefix)
      : undefined,
    properties,
    tokenPropertyPermissions,
    permissions,
  };

  return registry.createType<UpDataStructsCreateCollectionData>(
    'UpDataStructsCreateCollectionData',
    createData,
  );
};
