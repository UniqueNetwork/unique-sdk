import { CollectionLimits } from '../set-collection-limits/types';

export interface CollectionIdArguments {
  collectionId: number;
}

export interface GetCollectionLimitsResult {
  collectionId: number;
  limits: CollectionLimits;
}
