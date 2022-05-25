import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, NotEquals } from 'class-validator';
import {
  AddressArg,
  AnyObject,
  Balance,
  BurnCollectionArgs,
  BurnTokenArgs,
  ChainProperties,
  CollectionIdArg,
  CreateCollectionArgs,
  CreateTokenArgs,
  TokenIdArg,
  TransferBuildArgs,
  TransferCollectionArgs,
  TransferTokenArgs,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { HexString } from '@polkadot/util/types';

import { CollectionInfoBaseDto } from './unique-types';
import { NotYourselfAddress, ValidAddress } from '../validation';
import { SignerPayloadJSONDto, SignerPayloadRawDto } from './signer-payload';

const AddressApiProperty = ApiProperty({
  description: 'The ss-58 encoded address',
  example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
});

export class ChainPropertiesDto implements ChainProperties {
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

export class BalanceDto implements Balance {
  @ApiProperty({
    example: '411348197000000000000',
  })
  amount: string;

  @ApiProperty({
    example: '411.3481 QTZ',
  })
  formatted: string;

  // todo see sdk.ts line 50
  // todo formatted: string
  // todo withUnit: string
}

export class TransferBuildArgsDto implements TransferBuildArgs {
  @IsString()
  @ValidAddress()
  @NotYourselfAddress('destination')
  @AddressApiProperty
  address: string;

  @ValidAddress()
  @AddressApiProperty
  destination: string;

  @IsNumber()
  @IsPositive()
  @NotEquals(0)
  @ApiProperty({
    example: 0.01,
  })
  amount: number;
}

export class CollectionIdArgDto implements CollectionIdArg {
  @ApiProperty({
    example: 1,
  })
  collectionId: number;
}

export class TokenIdArgDto extends CollectionIdArgDto implements TokenIdArg {
  @ApiProperty({
    example: 1,
  })
  tokenId: number;
}

export class AddressArgDto implements AddressArg {
  @ValidAddress()
  @ApiProperty()
  address: string;
}

export class CreateCollectionArgsDto
  extends CollectionInfoBaseDto
  implements CreateCollectionArgs
{
  @AddressApiProperty
  address: string;
}

export class BurnCollectionArgsDto implements BurnCollectionArgs {
  @ApiProperty({
    example: 1,
  })
  collectionId: number;

  @ValidAddress()
  @AddressApiProperty
  address: string;
}

export class TransferCollectionArgsDto implements TransferCollectionArgs {
  @ApiProperty()
  collectionId: number;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;
}

export class CreateTokenArgsDto implements CreateTokenArgs {
  @ApiProperty({ example: 1 })
  collectionId: number;

  @ValidAddress()
  @AddressApiProperty
  address: string;

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

export class BurnTokenArgsDto extends TokenIdArgDto implements BurnTokenArgs {
  @ValidAddress()
  @AddressApiProperty
  address: string;
}
export class TransferTokenArgsDto
  extends TokenIdArgDto
  implements TransferTokenArgs
{
  @AddressApiProperty
  from: string;

  @AddressApiProperty
  to: string;
}

export class UnsignedTxPayloadDto implements UnsignedTxPayload {
  @ApiProperty()
  signerPayloadJSON: SignerPayloadJSONDto;

  @ApiProperty()
  signerPayloadRaw: SignerPayloadRawDto;

  @ApiProperty({ type: String })
  signerPayloadHex: HexString;
}
