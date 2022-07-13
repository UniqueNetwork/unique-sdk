/* eslint-disable max-classes-per-file */

import { ApiProperty } from '@nestjs/swagger';
import {
  CollectionIdArguments,
  CollectionInfoWithSchema,
  CreateCollectionArguments,
  CreateCollectionNewArguments,
  SetCollectionLimitsArguments,
} from '@unique-nft/sdk/tokens';
import { IsInt, IsPositive } from 'class-validator';
import {
  BurnCollectionArguments,
  TransferCollectionArguments,
} from '@unique-nft/sdk/types';
import {
  CollectionInfoBaseDto,
  CollectionInfoResponse,
  CollectionInfoWithPropertiesDto,
  CollectionLimitsDto,
} from '../../../../types/unique-types';
import { AddressApiProperty } from '../../../../types/sdk-methods';
import { MutationResponse } from '../../../../decorators/mutation-method';
import {
  UniqueCollectionSchemaDecodedDto,
  UniqueCollectionSchemaToCreateDto,
} from '../unique-schema';
import { ValidAddress } from '../../../../validation';

export class CollectionId {
  @ApiProperty({ example: 1 })
  @IsPositive()
  @IsInt()
  collectionId: number;
}

export class CreateCollectionBody
  extends CollectionInfoWithPropertiesDto
  implements CreateCollectionArguments
{
  @AddressApiProperty
  address: string;
}

export class CreateCollectionParsed implements CollectionIdArguments {
  @ApiProperty()
  collectionId: number;
}

export class CreateCollectionResponse extends MutationResponse {
  @ApiProperty()
  parsed: CreateCollectionParsed;
}

export class CreateCollectionNewRequest
  extends CollectionInfoBaseDto
  implements CreateCollectionNewArguments
{
  @AddressApiProperty
  address: string;

  @ApiProperty({ type: UniqueCollectionSchemaToCreateDto })
  schema: UniqueCollectionSchemaToCreateDto;
}

export class CollectionInfoWithSchemaResponse
  extends CollectionInfoResponse
  implements CollectionInfoWithSchema
{
  @ApiProperty({ type: UniqueCollectionSchemaDecodedDto })
  schema: UniqueCollectionSchemaDecodedDto;
}

export class CollectionIdQuery
  extends CollectionId
  implements CollectionIdArguments {}

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
