/* eslint-disable max-classes-per-file */

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, Equals } from 'class-validator';
import { Address } from '@unique-nft/sdk/types';
import { CollectionMode } from '@unique-nft/sdk/tokens';
import {
  CreateFungibleCollectionArguments,
  FungibleCollection,
  AddTokensArguments,
  AddTokensResult,
  TransferTokensArguments,
  TransferTokensResult,
  GetFungibleBalanceArgs,
} from '@unique-nft/sdk/fungible';
import { AddressApiProperty } from '../../../../types/sdk-methods';
import { CollectionInfoBaseDto } from '../../../../types/unique-types';
import { CreateCollectionNewRequest } from '../collection';

export class CreateFungibleCollectionRequest
  extends CreateCollectionNewRequest
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
  @ApiProperty({ example: 10, minimum: 0, maximum: 18, type: 'integer' })
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

export class AddTokensArgsDto implements AddTokensArguments {
  @AddressApiProperty
  address: Address;

  @ApiProperty({ required: false })
  recipient?: Address;

  @ApiProperty()
  collectionId: number;

  @ApiProperty()
  amount: number;
}

export class AddTokensResultDto implements AddTokensResult {
  @ApiProperty()
  recipient: Address;

  @ApiProperty()
  collectionId: number;

  @ApiProperty()
  amount: number;
}

export class TransferTokensArgsDto implements TransferTokensArguments {
  @AddressApiProperty
  address: Address;

  @AddressApiProperty
  recipient: Address;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  collectionId: number;
}

export class TransferTokensResultDto implements TransferTokensResult {
  @AddressApiProperty
  recipient: Address;

  @AddressApiProperty
  sender: Address;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  collectionId: number;
}

export class GetFungibleBalanceArgsRequest implements GetFungibleBalanceArgs {
  @AddressApiProperty
  address: Address;

  @ApiProperty()
  collectionId: number;
}
