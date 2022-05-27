import {
  sponsoredDataRateLimitToNumber,
  toBoolean,
  toNumber,
  bytesToString,
  utf16ToString,
  bytesToJson,
} from '@unique-nft/sdk/utils';

import type {
  UpDataStructsCollection,
  UpDataStructsSponsorshipState,
  UpDataStructsCollectionLimits,
} from '@unique-nft/types/unique';

import type {
  CollectionInfoBase,
  CollectionLimits,
  CollectionSponsorship,
} from '@unique-nft/sdk/types';

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

export const decodeCollection = (
  collection: UpDataStructsCollection,
): CollectionInfoBase => ({
  mode: collection.mode.type,
  access: collection.access.type,
  name: utf16ToString(collection.name),
  description: utf16ToString(collection.description),
  tokenPrefix: bytesToString(collection.tokenPrefix),
  mintMode: collection.mintMode.toHuman(),
  offchainSchema: bytesToString(collection.offchainSchema),
  constOnChainSchema: bytesToJson(collection.constOnChainSchema),
  variableOnChainSchema: bytesToJson(collection.variableOnChainSchema),
  schemaVersion: collection.schemaVersion.type,
  sponsorship: decodeCollectionSponsorship(collection.sponsorship),
  metaUpdatePermission: collection.metaUpdatePermission.type,
  limits: decodeCollectionLimits(collection.limits),
});
