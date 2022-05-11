import {
  AddressArg,
  Balance,
  SignatureType,
  SubmitTxArgs,
  TransferBuildArgs,
} from '@unique-nft/sdk';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { ApiProperty } from '@nestjs/swagger';

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
