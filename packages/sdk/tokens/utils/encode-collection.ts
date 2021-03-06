import type { Registry } from '@polkadot/types/types';
import {
  TokenPropertiesKeys,
  TokenPropertyPermissions,
} from '@unique-nft/sdk/types';
import type {
  UpDataStructsAccessMode,
  UpDataStructsCollectionPermissions,
  UpDataStructsCreateCollectionData,
  UpDataStructsNestingPermissions,
} from '@unique-nft/unique-mainnet-types/default';
import { stringToUTF16 } from '@unique-nft/sdk/utils';
import {
  encodeCollectionFields,
  encodeSponsoredDataRateLimit,
} from './encode-collection-fields';
import { validateOnChainSchema } from './validator';
import { CollectionProperty } from '../types';
import {
  CollectionInfoBase,
  CollectionInfoWithOldProperties,
  CollectionMode,
  CollectionPermissions,
  CollectionOldProperties,
  CollectionPropertiesKeys,
  TokenPropertiesPermissions,
} from '../methods/create-collection-ex/types';

const encodeCollectionProperties = (
  properties: CollectionOldProperties,
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
    validateOnChainSchema(constOnChainSchema);
    encodedProperties.push({
      key: CollectionPropertiesKeys.constOnChainSchema,
      value: JSON.stringify(constOnChainSchema),
    });
  } else if (properties.constOnChainSchema) {
    validateOnChainSchema(properties.constOnChainSchema);

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

const encodeCollectionMode = (collectionInfo: Partial<CollectionInfoBase>) => {
  const { mode, decimals } = collectionInfo;

  if (mode === CollectionMode.Fungible) {
    return { [CollectionMode.Fungible]: decimals || 0 };
  }

  return mode || CollectionMode.Nft;
};

export const encodeCollectionBase = (
  registry: Registry,
  collectionInfo: Partial<CollectionInfoBase>,
  extra?: Record<string, any>,
): UpDataStructsCreateCollectionData => {
  const permissions = collectionInfo.permissions
    ? encodeCollectionPermissions(registry, collectionInfo.permissions)
    : {};

  const limits = {
    ...collectionInfo.limits,
    ...(collectionInfo.limits?.sponsoredDataRateLimit
      ? {
          sponsoredDataRateLimit: encodeSponsoredDataRateLimit(
            registry,
            collectionInfo.limits.sponsoredDataRateLimit,
          ),
        }
      : {}),
  };

  const createData = {
    mode: encodeCollectionMode(collectionInfo),
    name: collectionInfo.name ? stringToUTF16(collectionInfo.name) : undefined,
    description: collectionInfo.description
      ? stringToUTF16(collectionInfo.description)
      : undefined,
    tokenPrefix: collectionInfo.tokenPrefix
      ? stringToUTF16(collectionInfo.tokenPrefix)
      : undefined,
    limits,
    permissions,
    readOnly: collectionInfo.readOnly,
    ...extra,
  };

  return registry.createType<UpDataStructsCreateCollectionData>(
    'UpDataStructsCreateCollectionData',
    createData,
  );
};

export const encodeCollection = (
  registry: Registry,
  collectionInfo: Partial<CollectionInfoWithOldProperties>,
): UpDataStructsCreateCollectionData => {
  const properties = collectionInfo.properties
    ? encodeCollectionProperties(collectionInfo.properties)
    : [];

  const tokenPropertyPermissions = encodeTokenPropertyPermissions(
    collectionInfo.tokenPropertyPermissions,
  );

  const base = encodeCollectionBase(registry, collectionInfo, {
    properties,
    tokenPropertyPermissions,
  });

  return registry.createType<UpDataStructsCreateCollectionData>(
    'UpDataStructsCreateCollectionData',
    base,
  );
};
