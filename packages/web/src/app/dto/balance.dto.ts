import {
  AddressArg,
  Balance,
  SignatureType,
  SubmitTxArgs,
  TransferBuildArgs,
} from '@unique-nft/sdk';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

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

export class BalanceTransferBuildRequest implements TransferBuildArgs {
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

export class BalanceTransferSubmitRequest implements SubmitTxArgs {
  /**
   * @example '0x01cc293085eaeff5358a27fdf32513f7889e5fd02321d75fbe4f3b4595942a7979a13abc08fd202005cd1615866c1bc77a1efd9812d6f1653f9e85fe22411bd08e'
   */
  signature: HexString;

  /**
   * @example '{"specVersion": "0x000e01fa", "address":  "...", "blockHash": "...", ...}'
   */
  signerPayloadJSON: SignerPayloadJSON;

  /**
   * @example 'sr25519'
   */
  signatureType?: SignatureType;
}
