import {
  UpDataStructsCollectionLimits,
  UpDataStructsCreateCollectionData,
  UpDataStructsSponsorshipState,
} from '@unique-nft/types/unique/types';
import { Registry } from '@polkadot/types/types';
import { UpDataStructsCollection } from '@unique-nft/types/unique';
import { objectSpread } from '@polkadot/util';
import type {
  CollectionInfo,
  CollectionLimits,
  CollectionSponsorship,
} from '../types';
import {
  sponsoredDataRateLimitToNumber,
  toBoolean,
  toNumber,
} from './option.utils';
import {
  bytesToString,
  utf16ToString,
  stringToUTF16,
  bytesToJson,
} from './string.utils';

export function decodeCollectionSponsorship(
  sponsorship: UpDataStructsSponsorshipState,
): CollectionSponsorship | null {
  return sponsorship.isDisabled
    ? null
    : {
        address: sponsorship.value.toString(),
        isConfirmed: sponsorship.isConfirmed,
      };
}

export function decodeCollectionLimits(
  limits: UpDataStructsCollectionLimits,
): CollectionLimits {
  return {
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
  };
}

export function decodeCollection(
  id: number,
  collection: UpDataStructsCollection,
): CollectionInfo {
  return {
    id,
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
    owner: collection.owner.toString(),
    limits: decodeCollectionLimits(collection.limits),
  };
}

export function encodeCollection(
  registry: Registry,
  collectionInfo: Partial<CollectionInfo>,
): UpDataStructsCreateCollectionData {
  const params: object[] = [collectionInfo];

  if (collectionInfo.name) {
    params.push({ name: stringToUTF16(collectionInfo.name) });
  }

  if (collectionInfo.description) {
    params.push({ description: stringToUTF16(collectionInfo.description) });
  }

  if (collectionInfo.tokenPrefix) {
    params.push({ tokenPrefix: stringToUTF16(collectionInfo.tokenPrefix) });
  }

  if (collectionInfo.constOnChainSchema) {
    params.push({
      constOnChainSchema: JSON.stringify(collectionInfo.constOnChainSchema),
    });
  }

  return registry.createType<UpDataStructsCreateCollectionData>(
    'UpDataStructsCreateCollectionData',
    objectSpread({}, ...params),
  );
}
