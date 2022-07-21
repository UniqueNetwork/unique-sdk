/* eslint-disable max-classes-per-file */

import { ApiProperty } from '@nestjs/swagger';
import {
  CollectionIdArguments,
  CollectionInfoWithSchema,
  CreateCollectionArguments,
  CreateCollectionNewArguments,
  SetCollectionLimitsArguments,
  SetCollectionPropertiesArguments,
  CollectionProperty,
  DeleteCollectionPropertiesArguments,
  SetTokenPropertyPermissionsArguments,
  PropertyKeyPermission,
  PropertyPermission,
} from '@unique-nft/sdk/tokens';
import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
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

  @ApiProperty({ type: UniqueCollectionSchemaToCreateDto, required: false })
  schema?: UniqueCollectionSchemaToCreateDto;
}

export class CollectionInfoWithSchemaResponse
  extends CollectionInfoResponse
  implements CollectionInfoWithSchema
{
  @ApiProperty({ type: UniqueCollectionSchemaDecodedDto, required: false })
  schema?: UniqueCollectionSchemaDecodedDto;
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

export class CollectionPropertyDto implements CollectionProperty {
  @ApiProperty({ example: 'example' })
  key: string;

  @ApiProperty({ example: 'example' })
  value: string;
}

export class SetCollectionPropertiesBody
  implements SetCollectionPropertiesArguments
{
  @ValidAddress()
  @AddressApiProperty
  address: string;

  @IsPositive()
  @IsInt()
  @ApiProperty({ example: 1 })
  collectionId: number;

  @ApiProperty({ type: [CollectionPropertyDto] })
  @Type(() => CollectionPropertyDto)
  properties: CollectionProperty[];
}

export class SetCollectionPropertiesResponse extends MutationResponse {}

export class DeleteCollectionPropertiesBody
  implements DeleteCollectionPropertiesArguments
{
  @ValidAddress()
  @AddressApiProperty
  address: string;

  @IsPositive()
  @IsInt()
  @ApiProperty({ example: 1 })
  collectionId: number;

  @ApiProperty({ type: [String], example: ['example'] })
  propertyKeys: string[];
}

export class DeleteCollectionPropertiesResponse extends MutationResponse {}

export class PropertyPermissionDto implements PropertyPermission {
  @ApiProperty({ default: true })
  mutable: boolean;

  @ApiProperty({ default: true })
  collectionAdmin: boolean;

  @ApiProperty({ default: true })
  tokenOwner: boolean;
}

export class PropertyKeyPermissionDto implements PropertyKeyPermission {
  @ApiProperty({ example: 'example' })
  key: string;

  @ApiProperty()
  permission: PropertyPermissionDto;
}

export class SetPropertyPermissionsBody
  implements SetTokenPropertyPermissionsArguments
{
  @ValidAddress()
  @AddressApiProperty
  address: string;

  @IsPositive()
  @IsInt()
  @ApiProperty({ example: 1 })
  collectionId: number;

  @ApiProperty({ type: [PropertyKeyPermissionDto] })
  @Type(() => PropertyKeyPermissionDto)
  propertyPermissions: PropertyKeyPermission[];
}

export class SetPropertyPermissionsResponse extends MutationResponse {}
