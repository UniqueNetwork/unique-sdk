import '@unique-nft/unique-mainnet-types/augment-api';

import { Sdk } from '@unique-nft/sdk';
import { MutationMethodWrap, QueryMethod } from '@unique-nft/sdk/extrinsics';

import {
  UnsignedTxPayload,
  BurnCollectionArguments,
  TransferCollectionArguments,
} from '@unique-nft/sdk/types';
import { CreateCollectionExMutation } from './methods/create-collection-ex/method';
import { CreateCollectionArguments } from './methods/create-collection-ex/types';
import { GetCollectionLimitsResult } from './methods/effective-collection-limits/types';
import { CollectionStatsResult } from './methods/collection-stats/types';
import { collectionById } from './methods/collection-by-id/method';
import { effectiveCollectionLimits } from './methods/effective-collection-limits/method';
import {
  CollectionIdArguments,
  CollectionInfo,
} from './methods/collection-by-id/types';
import {
  SetCollectionLimitsArguments,
  SetCollectionLimitsResult,
} from './types';
import { SetCollectionLimitsMutation } from './methods/set-collection-limits/method';
import { collectionStats } from './methods/collection-stats/method';

export class SdkCollections {
  constructor(readonly sdk: Sdk) {
    this.get = collectionById.bind(this.sdk);
    this.getLimits = effectiveCollectionLimits.bind(this.sdk);
    this.creation = new CreateCollectionExMutation(this.sdk);
    this.setLimits = new SetCollectionLimitsMutation(this.sdk);
    this.collectionStats = collectionStats.bind(this.sdk);
  }

  get: QueryMethod<CollectionIdArguments, CollectionInfo>;

  creation: MutationMethodWrap<
    CreateCollectionArguments,
    CollectionIdArguments
  >;

  getLimits: QueryMethod<CollectionIdArguments, GetCollectionLimitsResult>;

  setLimits: MutationMethodWrap<
    SetCollectionLimitsArguments,
    SetCollectionLimitsResult
  >;

  collectionStats: QueryMethod<void, CollectionStatsResult>;

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
