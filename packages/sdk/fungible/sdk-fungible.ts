import { Sdk } from '@unique-nft/sdk';
import { CreateCollectionMutation } from '@unique-nft/sdk/fungible/methods';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { CollectionIdArguments } from '@unique-nft/sdk/tokens';
import { collectionById, FungibleCollection } from './methods/get-collection';

export class SdkFungible {
  readonly createCollection: CreateCollectionMutation;

  readonly getCollection: QueryMethod<
    CollectionIdArguments,
    FungibleCollection
  >;

  constructor(readonly sdk: Sdk) {
    this.createCollection = new CreateCollectionMutation(sdk);
    this.getCollection = collectionById.bind(this.sdk);
  }
}
