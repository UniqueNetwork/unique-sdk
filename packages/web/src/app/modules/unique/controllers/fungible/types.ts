import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, Equals } from 'class-validator';
import { Address } from '@unique-nft/sdk/types';
import { CollectionMode } from '@unique-nft/sdk/tokens';
import { CreateFungibleCollectionArguments } from '@unique-nft/sdk/fungible';
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
