import { INamespace } from 'protobufjs';
import {
  bytesToJson,
  bytesToString,
  sponsoredDataRateLimitToNumber,
  toBoolean,
  toNumber,
  utf16ToString,
} from '@unique-nft/sdk/utils';

import type {
  UpDataStructsCollectionLimits,
  UpDataStructsCollectionPermissions,
  UpDataStructsProperty,
  UpDataStructsRpcCollection,
  UpDataStructsSponsorshipState,
  UpDataStructsPropertyKeyPermission,
} from '@unique-nft/unique-mainnet-types/default';

import type {
  CollectionLimits,
  CollectionPermissions,
  CollectionProperties,
  CollectionSponsorship,
} from '@unique-nft/sdk/types';
import {
  CollectionPropertiesKeys,
  CollectionSchemaVersion,
  TokenPropertiesKeys,
  TokenPropertiesPermissions,
  TokenPropertyPermissions,
} from '@unique-nft/sdk/types';
import { decodeCollectionFields } from './decode-collection-fields';
import { CollectionInfoBase } from '../mutations/create-collection-ex/types';

export const decodeCollectionSponsorship = (
  sponsorship: UpDataStructsSponsorshipState,
): CollectionSponsorship | null =>
  sponsorship.isDisabled
    ? null
    : {
        address: sponsorship.value.toString(),
        isConfirmed: sponsorship.isConfirmed,
      };

export const decodeCollectionLimits = (
  limits: UpDataStructsCollectionLimits,
): CollectionLimits => ({
  accountTokenOwnershipLimit: toNumber(limits.accountTokenOwnershipLimit),
  sponsoredDataSize: toNumber(limits.sponsoredDataSize),
  sponsoredDataRateLimit: sponsoredDataRateLimitToNumber(
    limits.sponsoredDataRateLimit,
  ),
  tokenLimit: toNumber(limits.tokenLimit),
  sponsorTransferTimeout: toNumber(limits.sponsorTransferTimeout),
  sponsorApproveTimeout: toNumber(limits.sponsorApproveTimeout),
  ownerCanTransfer: toBoolean(limits.ownerCanTransfer),
  ownerCanDestroy: toBoolean(limits.ownerCanDestroy),
  transfersEnabled: toBoolean(limits.transfersEnabled),
});

export const decodeCollectionPermissions = (
  permissions: UpDataStructsCollectionPermissions,
): CollectionPermissions => {
  const nesting = permissions.nesting.unwrapOrDefault();
  return {
    access: permissions.access.unwrapOrDefault()?.type,
    mintMode: toBoolean(permissions.mintMode) || false,
    nesting: {
      tokenOwner: nesting?.tokenOwner.isTrue,
      permissive: nesting?.permissive.isTrue,
      collectionAdmin: nesting?.collectionAdmin.isTrue,
    },
  };
};

export const decodeCollectionProperties = (
  properties: UpDataStructsProperty[],
): CollectionProperties => {
  const collectionProperties: CollectionProperties = {};
  let constOnChainSchema: INamespace;
  properties.forEach((property) => {
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
          decodeCollectionFields(constOnChainSchema);
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

const decodeTokenPropertiesPermissions = (
  tokenPropertiesPermissions: UpDataStructsPropertyKeyPermission[],
): TokenPropertiesPermissions => {
  const decodedPermissions: TokenPropertiesPermissions = {};
  tokenPropertiesPermissions.map((property) => {
    const key = bytesToString(property.key);
    switch (key) {
      case TokenPropertiesKeys.constData:
        decodedPermissions.constData = decodeTokenPropertyPermissions(property);
        break;
      default:
        break;
    }
    return true;
  });
  return decodedPermissions;
};

export const decodeCollection = (
  collection: UpDataStructsRpcCollection,
): CollectionInfoBase => ({
  mode: collection.mode.type,
  name: utf16ToString(collection.name),
  description: utf16ToString(collection.description),
  tokenPrefix: bytesToString(collection.tokenPrefix),
  sponsorship: decodeCollectionSponsorship(collection.sponsorship),
  limits: decodeCollectionLimits(collection.limits),

  permissions: decodeCollectionPermissions(collection.permissions),
  properties: decodeCollectionProperties(collection.properties),
  tokenPropertyPermissions: decodeTokenPropertiesPermissions(
    collection.tokenPropertyPermissions,
  ),
});
