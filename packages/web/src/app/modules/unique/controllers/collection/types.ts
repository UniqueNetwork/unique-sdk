/* eslint-disable max-classes-per-file */

import { ApiProperty } from '@nestjs/swagger';
import {
  CollectionIdArguments,
  CollectionInfoWithSchema,
  CreateCollectionArguments,
  CreateCollectionNewArguments,
  SetCollectionLimitsArguments,
  SetCollectionPropertiesArguments,
  CollectionProperty as CollectionPropertySDK,
  CollectionPropertySetEvent as CollectionPropertySetEventSDK,
  CollectionPropertyDeletedEvent as CollectionPropertyDeletedEventSDK,
  DeleteCollectionPropertiesArguments,
  SetTokenPropertyPermissionsArguments,
  PropertyKeyPermission as PropertyKeyPermissionSDK,
  PropertyPermission as PropertyPermissionSDK,
  PropertyPermissionSetEvent as PropertyPermissionSetEventSDK,
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
  CollectionInfoWithOldPropertiesDto,
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
  extends CollectionInfoWithOldPropertiesDto
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

export class CollectionProperty implements CollectionPropertySDK {
  @ApiProperty({ example: 'example' })
  key: string;

  @ApiProperty({ example: 'example' })
  value: string;
}

export class CollectionInfoWithSchemaResponse
  extends CollectionInfoResponse
  implements CollectionInfoWithSchema
{
  @ApiProperty({ type: UniqueCollectionSchemaDecodedDto, required: false })
  schema?: UniqueCollectionSchemaDecodedDto;

  @ApiProperty({ type: CollectionProperty, isArray: true })
  properties: CollectionProperty[];
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

  @ApiProperty({ type: [CollectionProperty] })
  @Type(() => CollectionProperty)
  properties: CollectionProperty[];
}

export class CollectionPropertySetEvent
  implements CollectionPropertySetEventSDK
{
  @ApiProperty({ example: 1 })
  collectionId: number;

  @ApiProperty({ example: 'example' })
  propertyKey: string;
}

export class SetCollectionPropertiesResponse extends MutationResponse {
  @ApiProperty({ type: CollectionPropertySetEvent, isArray: true })
  parsed: CollectionPropertySetEvent[];
}

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

export class CollectionPropertyDeletedEvent
  implements CollectionPropertyDeletedEventSDK
{
  @ApiProperty({ example: 1 })
  collectionId: number;

  @ApiProperty({ example: 'example' })
  propertyKey: string;
}

export class DeleteCollectionPropertiesResponse extends MutationResponse {
  @ApiProperty({ type: CollectionPropertyDeletedEvent, isArray: true })
  parsed: CollectionPropertyDeletedEvent[];
}

export class PropertyPermission implements PropertyPermissionSDK {
  @ApiProperty({ default: true })
  mutable: boolean;

  @ApiProperty({ default: true })
  collectionAdmin: boolean;

  @ApiProperty({ default: true })
  tokenOwner: boolean;
}

export class PropertyKeyPermission implements PropertyKeyPermissionSDK {
  @ApiProperty({ example: 'example' })
  key: string;

  @ApiProperty()
  permission: PropertyPermission;
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

  @ApiProperty({ type: [PropertyKeyPermission] })
  @Type(() => PropertyKeyPermission)
  propertyPermissions: PropertyKeyPermission[];
}

export class PropertyPermissionSetEvent
  implements PropertyPermissionSetEventSDK
{
  @ApiProperty({ example: 1 })
  collectionId: number;

  @ApiProperty({ example: 'example' })
  propertyKey: string;
}

export class SetPropertyPermissionsResponse extends MutationResponse {
  @ApiProperty({ type: PropertyPermissionSetEvent, isArray: true })
  parsed: PropertyPermissionSetEvent[];
}
