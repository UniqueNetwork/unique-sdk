import { INamespace } from 'protobufjs';
import {
  bytesToJson,
  bytesToString,
  utf16ToString,
} from '@unique-nft/sdk/utils';

import type {
  UpDataStructsCollectionPermissions,
  UpDataStructsProperty,
  UpDataStructsRpcCollection,
  UpDataStructsSponsorshipState,
  UpDataStructsPropertyKeyPermission,
} from '@unique-nft/unique-mainnet-types/default';

import {
  CollectionSchemaVersion,
  TokenPropertiesKeys,
  TokenPropertyPermissions,
} from '@unique-nft/sdk/types';
import { decodeCollectionFields } from './decode-collection-fields';
import {
  CollectionInfoBase,
  CollectionPermissions,
  CollectionProperties,
  CollectionSponsorship,
  TokenPropertiesPermissions,
  CollectionPropertiesKeys,
  CollectionInfoWithProperties,
} from '../methods/create-collection-ex/types';
import {
  decodeCollectionLimits,
  toBoolean,
} from '../methods/set-collection-limits/utils';

export const decodeCollectionSponsorship = (
  sponsorship: UpDataStructsSponsorshipState,
): CollectionSponsorship | null =>
  sponsorship.isDisabled
    ? null
    : {
        address: sponsorship.value.toString(),
        isConfirmed: sponsorship.isConfirmed,
      };

export const decodeCollectionPermissions = (
  permissions: UpDataStructsCollectionPermissions,
): CollectionPermissions => {
  const nesting = permissions.nesting.unwrapOrDefault();

  return {
    access: permissions.access.unwrapOrDefault()?.type,
    mintMode: toBoolean(permissions.mintMode) || false,
    nesting: {
      tokenOwner: nesting?.tokenOwner?.isTrue,
      collectionAdmin: nesting?.collectionAdmin?.isTrue,
    },
  };
};

export const decodeCollectionProperties = (
  properties?: UpDataStructsProperty[],
): CollectionProperties => {
  const collectionProperties: CollectionProperties = {};
  let constOnChainSchema: INamespace | undefined;

  properties?.forEach((property) => {
    switch (property.key.toHuman()) {
      case CollectionPropertiesKeys.offchainSchema:
        collectionProperties.offchainSchema = bytesToString(property.value);
        break;
      case CollectionPropertiesKeys.schemaVersion:
        collectionProperties.schemaVersion = bytesToString(
          property.value,
        ) as CollectionSchemaVersion;
        break;
      case CollectionPropertiesKeys.variableOnChainSchema:
        collectionProperties.variableOnChainSchema = bytesToString(
          property.value,
        );
        break;
      case CollectionPropertiesKeys.constOnChainSchema:
        constOnChainSchema = bytesToJson(property.value);
        collectionProperties.constOnChainSchema = constOnChainSchema;

        collectionProperties.fields =
          constOnChainSchema && decodeCollectionFields(constOnChainSchema);
        break;
      default:
        break;
    }
  });
  return collectionProperties;
};

const decodeTokenPropertyPermissions = (
  property: UpDataStructsPropertyKeyPermission,
): TokenPropertyPermissions => ({
  mutable: property.permission.mutable.toHuman(),
  collectionAdmin: property.permission.collectionAdmin.toHuman(),
  tokenOwner: property.permission.tokenOwner.toHuman(),
});

export const decodeCollectionBase = (
  collection: UpDataStructsRpcCollection,
): CollectionInfoBase => ({
  mode: collection.mode.type,
  name: utf16ToString(collection.name),
  description: utf16ToString(collection.description),
  tokenPrefix: bytesToString(collection.tokenPrefix),
  sponsorship: decodeCollectionSponsorship(collection.sponsorship),
  limits: decodeCollectionLimits(collection.limits),

  permissions: decodeCollectionPermissions(collection.permissions),
});

const decodeTokenPropertiesPermissions = (
  tokenPropertiesPermissions: UpDataStructsPropertyKeyPermission[],
): TokenPropertiesPermissions => {
  const constProperty = tokenPropertiesPermissions?.find(
    ({ key }) => bytesToString(key) === TokenPropertiesKeys.constData,
  );

  return constProperty
    ? { constData: decodeTokenPropertyPermissions(constProperty) }
    : {};
};

export const decodeCollection = (
  collection: UpDataStructsRpcCollection,
): CollectionInfoWithProperties => ({
  ...decodeCollectionBase(collection),
  properties: decodeCollectionProperties(collection.properties),
  tokenPropertyPermissions: decodeTokenPropertiesPermissions(
    collection.tokenPropertyPermissions,
  ),
});
