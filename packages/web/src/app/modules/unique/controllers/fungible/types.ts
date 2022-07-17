/* eslint-disable max-classes-per-file */

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, Equals } from 'class-validator';
import { Address } from '@unique-nft/sdk/types';
import { CollectionMode } from '@unique-nft/sdk/tokens';
import {
  CreateFungibleCollectionArguments,
  FungibleCollection,
} from '@unique-nft/sdk/fungible';
import { AddressApiProperty } from '../../../../types/sdk-methods';
import { CollectionInfoBaseDto } from '../../../../types/unique-types';

export class CreateFungibleCollectionRequest
  extends CollectionInfoBaseDto
  implements CreateFungibleCollectionArguments
{
  @Equals(CollectionMode.Fungible)
  @ApiProperty({ example: CollectionMode.Fungible })
  mode: CollectionMode.Fungible;

  @AddressApiProperty
  address: Address;

  @IsInt()
  @Min(0)
  @Max(255)
  @ApiProperty({ example: 255, minimum: 0, maximum: 255, type: 'integer' })
  decimals: number;
}

export class FungibleCollectionInfoDto
  extends CollectionInfoBaseDto
  implements FungibleCollection
{
  @ApiProperty()
  decimals: number;

  @ApiProperty()
  id: number;

  @ApiProperty({
    description: 'The ss-58 encoded address',
    example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
  })
  owner: string;
}
