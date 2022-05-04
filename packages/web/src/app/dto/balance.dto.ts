import { AddressArg, Balance } from '@unique-nft/sdk';

export class BalanceResponse implements Balance {
  /**
   * @example '411348197000000000000'
   */
  amount: string;

  /**
   * @example '411.3481 QTZ'
   */
  formatted: string;

  // todo see sdk.ts line 50
  // todo formatted: string
  // todo withUnit: string
}

export class BalanceRequest implements AddressArg {
  /**
   * @example 'yGEeaYLrnw8aiTFj5QZAmwWRKu6QdxUkaASLCQznuZX2Lyj7q'
   */
  address: string;
}

export class BalanceTransferBuildRequest {
  /**
   * @example 'yGEeaYLrnw8aiTFj5QZAmwWRKu6QdxUkaASLCQznuZX2Lyj7q'
   */
  address: string;

  /**
   * @example 'yGEeaYLrnw8aiTFj5QZAmwWRKu6QdxUkaASLCQznuZX2Lyj7q'
   */
  destination: string;

  /**
   * @example '0.001'
   */
  amount: number;
}
