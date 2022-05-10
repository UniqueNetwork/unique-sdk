import {
  CreateTokenArgs,
  BurnTokenArgs,
  TransferTokenArgs,
} from '@unique-nft/sdk';

export class CreateTokenRequest implements CreateTokenArgs {
  address: string;

  collectionId: number;

  constData: Record<string, any>;
}

export class BurnTokenRequest implements BurnTokenArgs {
  address: string;

  collectionId: number;

  tokenId: number;
}

export class TransferTokenRequest implements TransferTokenArgs {
  collectionId: number;

  from: string;

  to: string;

  tokenId: number;
}
