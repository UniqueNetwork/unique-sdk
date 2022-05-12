import { TransferCollectionArgs } from '@unique-nft/sdk';

export class TransferCollectionDto implements TransferCollectionArgs {
  collectionId: number;

  from: string;

  to: string;
}
