import {
  CollectionIdArg,
  TokenIdArg,
  BurnCollectionArgs,
  TransferCollectionArgs,
} from '@unique-nft/sdk';

export class CollectionGetRequest implements CollectionIdArg {
  /**
   * @example 1
   */
  collectionId: number;
}

export class TokenGetRequest implements TokenIdArg {
  /**
   * @example 1
   */
  collectionId: number;

  /**
   * @example 1
   */
  tokenId: number;
}

export class BurnCollectionDto implements BurnCollectionArgs {
  /**
   * @description The ss-58 encoded address
   * @example 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm'
   */
  address: string;

  collectionId: number;
}

export class TransferCollectionDto implements TransferCollectionArgs {
  collectionId: number;

  from: string;

  to: string;
}
