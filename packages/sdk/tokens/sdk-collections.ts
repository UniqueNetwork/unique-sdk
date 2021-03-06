import '@unique-nft/unique-mainnet-types/augment-api';

import { Sdk } from '@unique-nft/sdk';
import { MutationMethodWrap, QueryMethod } from '@unique-nft/sdk/extrinsics';
import {
  UnsignedTxPayload,
  BurnCollectionArguments,
  TransferCollectionArguments,
} from '@unique-nft/sdk/types';
import {
  SetCollectionSponsorArguments,
  SetCollectionSponsorMutation,
  SetCollectionSponsorResult,
} from './methods/set-collection-sponsor';
import {
  RemoveCollectionSponsorArguments,
  RemoveCollectionSponsorMutation,
  RemoveCollectionSponsorResult,
} from './methods/remove-collection-sponsor';
import {
  ConfirmSponsorshipArguments,
  ConfirmSponsorshipMutation,
  ConfirmSponsorshipResult,
} from './methods/confirm-sponsorship';
import { CreateCollectionExMutation } from './methods/create-collection-ex/method';
import { CreateCollectionArguments } from './methods/create-collection-ex/types';
import { GetCollectionLimitsResult } from './methods/effective-collection-limits/types';
import { GetStatsResult } from './methods/get-stats/types';
import { collectionById } from './methods/collection-by-id/method';
import { collectionByIdNew } from './methods/collection-by-id-new/method';
import { effectiveCollectionLimits } from './methods/effective-collection-limits/method';
import { CollectionInfo } from './methods/collection-by-id/types';
import {
  CollectionIdArguments,
  SetCollectionLimitsArguments,
  SetCollectionLimitsResult,
} from './types';
import { SetCollectionLimitsMutation } from './methods/set-collection-limits/method';
import { getStats } from './methods/get-stats/method';
import { CollectionInfoWithSchema } from './methods/collection-by-id-new/types';
import { CreateCollectionExNewMutation } from './methods/create-collection-ex-new/method';
import { CreateCollectionNewArguments } from './methods/create-collection-ex-new/types';
import {
  SetTokenPropertyPermissionsMutation,
  SetTokenPropertyPermissionsArguments,
  SetTokenPropertyPermissionsResult,
} from './methods/set-token-property-permissions';
import {
  SetCollectionPropertiesArguments,
  SetCollectionPropertiesResult,
  SetCollectionPropertiesMutation,
} from './methods/set-collection-properties';
import {
  DeleteCollectionPropertiesArguments,
  DeleteCollectionPropertiesResult,
  DeleteCollectionPropertiesMutation,
} from './methods/delete-collection-properties';
import {
  collectionPropertiesQuery,
  CollectionPropertiesArguments,
  CollectionPropertiesResult,
} from './methods/collection-properties';
import {
  PropertyPermissionsArguments,
  propertyPermissionsQuery,
  PropertyPermissionsResult,
} from './methods/property-permissions';

export class SdkCollections {
  constructor(readonly sdk: Sdk) {
    this.get = collectionById.bind(this.sdk);
    this.get_new = collectionByIdNew.bind(this.sdk);
    this.getLimits = effectiveCollectionLimits.bind(this.sdk);
    this.creation = new CreateCollectionExMutation(this.sdk);
    this.creation_new = new CreateCollectionExNewMutation(this.sdk);
    this.setLimits = new SetCollectionLimitsMutation(this.sdk);
    this.getStats = getStats.bind(this.sdk);
    this.setProperties = new SetCollectionPropertiesMutation(this.sdk);
    this.deleteProperties = new DeleteCollectionPropertiesMutation(this.sdk);
    this.setPropertyPermissions = new SetTokenPropertyPermissionsMutation(
      this.sdk,
    );
    this.properties = collectionPropertiesQuery.bind(this.sdk);
    this.propertyPermissions = propertyPermissionsQuery.bind(this.sdk);
    this.setCollectionSponsor = new SetCollectionSponsorMutation(this.sdk);
    this.confirmSponsorship = new ConfirmSponsorshipMutation(this.sdk);
    this.removeCollectionSponsor = new RemoveCollectionSponsorMutation(this.sdk);
  }

  get: QueryMethod<CollectionIdArguments, CollectionInfo>;

  get_new: QueryMethod<CollectionIdArguments, CollectionInfoWithSchema>;

  creation: MutationMethodWrap<
    CreateCollectionArguments,
    CollectionIdArguments
  >;

  creation_new: MutationMethodWrap<
    CreateCollectionNewArguments,
    CollectionIdArguments
  >;

  getLimits: QueryMethod<CollectionIdArguments, GetCollectionLimitsResult>;

  setLimits: MutationMethodWrap<
    SetCollectionLimitsArguments,
    SetCollectionLimitsResult
  >;

  getStats: QueryMethod<void, GetStatsResult>;

  setProperties: MutationMethodWrap<
    SetCollectionPropertiesArguments,
    SetCollectionPropertiesResult
  >;

  deleteProperties: MutationMethodWrap<
    DeleteCollectionPropertiesArguments,
    DeleteCollectionPropertiesResult
  >;

  setPropertyPermissions: MutationMethodWrap<
    SetTokenPropertyPermissionsArguments,
    SetTokenPropertyPermissionsResult
  >;

  setCollectionSponsor: MutationMethodWrap<
    SetCollectionSponsorArguments,
    SetCollectionSponsorResult
  >;

  confirmSponsorship: MutationMethodWrap<
    ConfirmSponsorshipArguments,
    ConfirmSponsorshipResult
  >;

  removeCollectionSponsor: MutationMethodWrap<
    RemoveCollectionSponsorArguments,
    RemoveCollectionSponsorResult
  >;

  properties: QueryMethod<
    CollectionPropertiesArguments,
    CollectionPropertiesResult
  >;

  propertyPermissions: QueryMethod<
    PropertyPermissionsArguments,
    PropertyPermissionsResult
  >;

  transfer(args: TransferCollectionArguments): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build({
      address: args.from,
      section: 'unique',
      method: 'changeCollectionOwner',
      args: [args.collectionId, args.to],
    });
  }

  burn(args: BurnCollectionArguments): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build({
      address: args.address,
      section: 'unique',
      method: 'destroyCollection',
      args: [args.collectionId],
    });
  }
}
