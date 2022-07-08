/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsInt,
  IsNumberString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { HexString } from '@polkadot/util/types';
import { Transform } from 'class-transformer';
import {
  AddressArguments,
  AllBalances,
  AnyObject,
  Balance,
  BurnCollectionArguments,
  ChainProperties,
  CreateTokenArguments,
  Fee,
  TransferCollectionArguments,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import {
  BurnTokenArguments,
  CollectionIdArguments,
  TokenIdArguments,
  TransferTokenArguments,
  CreateCollectionArguments,
  SetCollectionLimitsArguments,
} from '@unique-nft/sdk/tokens/types';
import { TransferBuildArguments } from '@unique-nft/sdk/balance/types';

import { CollectionInfoBaseDto, CollectionLimitsDto } from './unique-types';
import { NotYourselfAddress, ValidAddress } from '../validation';
import { SignerPayloadJSONDto, SignerPayloadRawDto } from './signer-payload';

const AddressApiProperty = ApiProperty({
  description: 'The ss-58 encoded address',
  example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
});

const AnyToBoolean = Transform(({ obj = {}, key }) => {
  const asString = String(obj && obj[key]).toLowerCase();

  return asString === 'true' || asString === '1';
});

export class WithFeeQuery {
  @AnyToBoolean
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
  })
  withFee?: boolean;
}

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

export class TransferBuildBody implements TransferBuildArguments {
  @IsString()
  @ValidAddress()
  @NotYourselfAddress('destination')
  @AddressApiProperty
  address: string;

  @ValidAddress()
  @ApiProperty({ example: 'unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx' })
  @AddressApiProperty
  destination: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    example: 0.01,
  })
  amount: number;
}

export class CollectionIdQuery implements CollectionIdArguments {
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 1,
  })
  collectionId: number;
}

export class TokenIdQuery
  extends CollectionIdQuery
  implements TokenIdArguments
{
  @IsPositive()
  @IsInt()
  @ApiProperty({
    example: 1,
  })
  tokenId: number;
}

export class AddressQuery implements AddressArguments {
  @ValidAddress()
  @ApiProperty()
  address: string;
}

export class CreateCollectionBody
  extends CollectionInfoBaseDto
  implements CreateCollectionArguments
{
  @AddressApiProperty
  address: string;
}

export class CollectionIdResponse implements CollectionIdArguments {
  @ApiProperty()
  collectionId: number;
}

export class SetCollectionLimitsBody implements SetCollectionLimitsArguments {
  @ApiProperty({
    description: 'The collection limits',
  })
  limits: CollectionLimitsDto;

  @ValidAddress()
  @ApiProperty({ example: 'unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx' })
  @AddressApiProperty
  address: string;

  @IsPositive()
  @IsInt()
  @ApiProperty({
    example: 1,
  })
  collectionId: number;
}

export class BurnCollectionBody implements BurnCollectionArguments {
  @IsPositive()
  @IsInt()
  @ApiProperty({
    example: 1,
  })
  collectionId: number;

  @ValidAddress()
  @AddressApiProperty
  address: string;
}

export class TransferCollectionBody implements TransferCollectionArguments {
  @IsPositive()
  @IsInt()
  @ApiProperty({
    example: 1,
  })
  collectionId: number;

  @ValidAddress()
  @AddressApiProperty
  from: string;

  @ValidAddress()
  @AddressApiProperty
  to: string;
}

export class CreateTokenBody
  extends AddressQuery
  implements CreateTokenArguments
{
  @IsPositive()
  @IsInt()
  @ApiProperty({ example: 1 })
  collectionId: number;

  @IsOptional()
  @ValidAddress()
  @AddressApiProperty
  owner?: string;

  @ApiProperty({
    example: {
      ipfsJson:
        '{"ipfs":"QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb","type":"image"}',
      gender: 'Male',
      traits: ['TEETH_SMILE', 'UP_HAIR'],
    },
  })
  constData: AnyObject;
}

export class BurnTokenBody extends TokenIdQuery implements BurnTokenArguments {
  @ValidAddress()
  @AddressApiProperty
  address: string;
}

export class TransferTokenBody
  extends TokenIdQuery
  implements TransferTokenArguments
{
  @ValidAddress()
  @AddressApiProperty
  from: string;

  @ValidAddress()
  @AddressApiProperty
  to: string;
}

export class UnsignedTxPayloadResponse implements UnsignedTxPayload {
  @ApiProperty()
  signerPayloadJSON: SignerPayloadJSONDto;

  @ApiProperty()
  signerPayloadRaw: SignerPayloadRawDto;

  @ApiProperty({ type: String })
  signerPayloadHex: HexString;
}

export class UnsignedTxPayloadResponseWithFee extends UnsignedTxPayloadResponse {
  @ApiProperty({ type: FeeResponse, required: false })
  fee?: Balance;
}

export class UnsignedTxPayloadBody extends UnsignedTxPayloadResponse {}
