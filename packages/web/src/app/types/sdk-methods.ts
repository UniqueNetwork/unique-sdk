/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsNumberString } from 'class-validator';
import { HexString } from '@polkadot/util/types';
import {
  AddressArguments,
  AllBalances,
  Balance,
  ChainProperties,
  Fee,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';

import { ValidAddress } from '../validation';
import { SignerPayloadJSONDto, SignerPayloadRawDto } from './signer-payload';

export const AddressApiProperty = ApiProperty({
  description: 'The ss-58 encoded address',
  example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
});

export class ChainPropertiesResponse implements ChainProperties {
  @ApiProperty({
    example: 255,
  })
  SS58Prefix: number;

  @ApiProperty({
    example: 'QTZ',
  })
  token: string;

  @ApiProperty({
    example: 18,
  })
  decimals: number;

  @ApiProperty({
    example: 'wss://ws-quartz.unique.network',
  })
  wsUrl: string;

  @ApiProperty({
    example:
      '0xe9fa5b65a927e85627d87572161f0d86ef65d1432152d59b7a679fb6c7fd3b39',
  })
  genesisHash: HexString;
}

export class BalanceResponse implements Balance {
  @IsNumberString()
  @ApiProperty({
    example: '92485000000000000',
  })
  raw: string;

  @IsNumber()
  @ApiProperty({ example: '0.092485000000000000' })
  amount: string;

  @IsString()
  @ApiProperty({
    example: '92.4850 m',
  })
  formatted: string;

  @IsString()
  @ApiProperty({
    example: 'UNQ',
  })
  unit: string;

  @IsInt()
  @ApiProperty({
    example: 18,
  })
  decimals: number;
}

export class AllBalancesResponse implements AllBalances {
  @ApiProperty({ type: BalanceResponse })
  availableBalance: BalanceResponse;

  @ApiProperty({ type: BalanceResponse })
  lockedBalance: BalanceResponse;

  @ApiProperty({ type: BalanceResponse })
  freeBalance: BalanceResponse;
}

export class FeeResponse extends BalanceResponse implements Fee {}

export class AddressQuery implements AddressArguments {
  @ValidAddress()
  @ApiProperty()
  address: string;
}

export class UnsignedTxPayloadResponse implements UnsignedTxPayload {
  @ApiProperty()
  signerPayloadJSON: SignerPayloadJSONDto;

  @ApiProperty()
  signerPayloadRaw: SignerPayloadRawDto;

  @ApiProperty({ type: String })
  signerPayloadHex: HexString;

  @ApiProperty({ type: FeeResponse, required: false })
  fee?: FeeResponse;
}

export class UnsignedTxPayloadBody extends UnsignedTxPayloadResponse {}
