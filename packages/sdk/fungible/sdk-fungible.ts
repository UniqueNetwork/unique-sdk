import { Sdk } from '@unique-nft/sdk';
import { CreateCollectionMutation } from '@unique-nft/sdk/fungible/methods';

export class SdkFungible {
  readonly createCollection: CreateCollectionMutation;

  constructor(readonly sdk: Sdk) {
    this.createCollection = new CreateCollectionMutation(sdk);
  }
}
