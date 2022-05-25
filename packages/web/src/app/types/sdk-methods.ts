import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, NotEquals } from 'class-validator';
import {
  AddressArguments,
  AnyObject,
  Balance,
  BurnCollectionArguments,
  BurnTokenArguments,
  ChainProperties,
  CollectionIdArguments,
  CreateCollectionArguments,
  CreateTokenArguments,
  TokenIdArguments,
  TransferBuildArguments,
  TransferCollectionArguments,
  TransferTokenArguments,
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

export class TransferBuildBody implements TransferBuildArguments {
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

export class CollectionIdQuery implements CollectionIdArguments {
  @ApiProperty({
    example: 1,
  })
  collectionId: number;
}

export class TokenIdQuery
  extends CollectionIdQuery
  implements TokenIdArguments
{
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

export class BurnCollectionBody implements BurnCollectionArguments {
  @ApiProperty({
    example: 1,
  })
  collectionId: number;

  @ValidAddress()
  @AddressApiProperty
  address: string;
}

export class TransferCollectionBody implements TransferCollectionArguments {
  @ApiProperty()
  collectionId: number;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;
}

export class CreateTokenBody implements CreateTokenArguments {
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

export class BurnTokenBody extends TokenIdQuery implements BurnTokenArguments {
  @ValidAddress()
  @AddressApiProperty
  address: string;
}
export class TransferTokenBody
  extends TokenIdQuery
  implements TransferTokenArguments
{
  @AddressApiProperty
  from: string;

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
