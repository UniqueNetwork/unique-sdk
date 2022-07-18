import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { CollectionIdArguments } from '@unique-nft/sdk/tokens';
import { Balance } from '@unique-nft/sdk/types';
import {
  CreateCollectionMutation,
  collectionById,
  getFungibleBalance,
  TransferTokensMutation,
  FungibleCollection,
  AddTokensMutation,
  GetFungibleBalanceArgs,
} from './methods';

export class SdkFungible {
  readonly createCollection: CreateCollectionMutation;

  readonly addTokens: AddTokensMutation;

  readonly transferTokens: TransferTokensMutation;

  readonly getCollection: QueryMethod<
    CollectionIdArguments,
    FungibleCollection
  >;

  readonly getBalance: QueryMethod<GetFungibleBalanceArgs, Balance>;

  constructor(readonly sdk: Sdk) {
    this.createCollection = new CreateCollectionMutation(sdk);
    this.addTokens = new AddTokensMutation(sdk);
    this.transferTokens = new TransferTokensMutation(this.sdk);

    this.getCollection = collectionById.bind(this.sdk);
    this.getBalance = getFungibleBalance.bind(this.sdk);
  }
}
