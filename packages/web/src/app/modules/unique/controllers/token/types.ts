/* eslint-disable max-classes-per-file */
import {
  DeleteTokenPropertiesArguments,
  NestTokenArguments,
  SetTokenPropertiesArguments,
  TokenIdArguments,
  TokenParentResult,
  TopmostTokenOwnerResult,
  TransferArguments,
  UnnestTokenArguments,
  TransferResult,
  TokenProperty as TokenPropertySDK,
  TokenPropertySetEvent as TokenPropertySetEventSDK,
  TokenPropertyDeletedEvent as TokenPropertyDeletedEventSDK,
  BurnItemArguments as BurnItemArgumentsSDK,
  BurnItemResult as BurnItemResultSDK,
} from '@unique-nft/sdk/tokens';
import { ApiProperty } from '@nestjs/swagger';
import {
  Address,
  AnyObject,
  CreateTokenArguments,
  CrossAccountId,
} from '@unique-nft/sdk/types';
import { IsInt, IsOptional, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidAddress } from '../../../../validation';
import { CollectionId } from '../collection';
import { MutationResponse } from '../../../../decorators/mutation-method/types';

import {
  AddressApiProperty,
  AddressQuery,
} from '../../../../types/sdk-methods';

export class TokenId extends CollectionId {
  @ApiProperty({ example: 1 })
  @IsPositive()
  @IsInt()
  tokenId: number;
}

export class TokenIdQuery extends TokenId implements TokenIdArguments {}

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

export class TransferTokenBody extends TokenId implements TransferArguments {
  @ValidAddress()
  @AddressApiProperty
  from: string;

  @ValidAddress()
  @AddressApiProperty
  to: string;
}

export class TransferTokenParsed implements TransferResult {
  @ApiProperty({ example: 1 })
  collectionId: number;

  @ApiProperty({ example: 1 })
  tokenId: number;

  @ApiProperty({ description: 'Sender address' })
  from: CrossAccountId;

  @ApiProperty({ description: 'Recipient address' })
  to: CrossAccountId;
}

export class TransferTokenResponse extends MutationResponse {
  @ApiProperty()
  parsed: TransferTokenParsed;
}

export class NestTokenBody implements NestTokenArguments {
  @ValidAddress()
  @ApiProperty({ example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm' })
  address: Address;

  @ValidateNested()
  @ApiProperty({ description: 'Parent token object' })
  parent: TokenId;

  @ValidateNested()
  @ApiProperty({ description: 'Nested token object' })
  nested: TokenId;
}

export class NestTokenResponse extends MutationResponse {
  @ApiProperty()
  parsed: TokenId;
}

export class UnnestTokenBody implements UnnestTokenArguments {
  @ValidAddress()
  @ApiProperty({ example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm' })
  address: Address;

  @ValidateNested()
  @ApiProperty({ description: 'Parent token object' })
  parent: TokenId;

  @ValidateNested()
  @ApiProperty({ description: 'Nested token object' })
  nested: TokenId;
}

export class UnnestTokenResponse extends MutationResponse {
  @ApiProperty()
  parsed: TokenId;
}

export class TokenParentResponse extends TokenId implements TokenParentResult {
  @ApiProperty({ example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm' })
  address: Address;
}

export class TopmostTokenOwnerResponse {
  @ApiProperty({ example: 'unjq56sK9skTMR1MyPLsDFXkQdRNNrD1gzE4wRJSYm2k6GjJn' })
  topmostOwner: TopmostTokenOwnerResult;
}

export class TokenProperty implements TokenPropertySDK {
  @ApiProperty({ example: 'example' })
  key: string;

  @ApiProperty({ example: 'example' })
  value: string;
}

export class SetTokenPropertiesBody implements SetTokenPropertiesArguments {
  @ValidAddress()
  @AddressApiProperty
  address: string;

  @IsPositive()
  @IsInt()
  @ApiProperty({ example: 1 })
  collectionId: number;

  @IsPositive()
  @IsInt()
  @ApiProperty({ example: 1 })
  tokenId: number;

  @ApiProperty({ type: [TokenProperty] })
  @Type(() => TokenProperty)
  properties: TokenProperty[];
}

export class TokenPropertySetEvent implements TokenPropertySetEventSDK {
  @ApiProperty({ example: 1 })
  collectionId: number;

  @ApiProperty({ example: 1 })
  tokenId: number;

  @ApiProperty({ example: 'example' })
  propertyKey: string;
}

export class SetTokenPropertiesResponse extends MutationResponse {
  @ApiProperty({ type: TokenPropertySetEvent, isArray: true })
  parsed: TokenPropertySetEvent[];
}

export class DeleteTokenPropertiesBody
  implements DeleteTokenPropertiesArguments
{
  @ValidAddress()
  @AddressApiProperty
  address: string;

  @IsPositive()
  @IsInt()
  @ApiProperty({ example: 1 })
  collectionId: number;

  @IsPositive()
  @IsInt()
  @ApiProperty({ example: 1 })
  tokenId: number;

  @ApiProperty({ type: [String], example: ['example'] })
  propertyKeys: string[];
}

export class TokenPropertyDeletedEvent implements TokenPropertyDeletedEventSDK {
  @ApiProperty({ example: 1 })
  collectionId: number;

  @ApiProperty({ example: 1 })
  tokenId: number;

  @ApiProperty({ example: 'example' })
  propertyKey: string;
}

export class DeleteTokenPropertiesResponse extends MutationResponse {
  @ApiProperty({ type: TokenPropertyDeletedEvent, isArray: true })
  parsed: TokenPropertyDeletedEvent[];
}

export class BurnItemBody extends TokenId implements BurnItemArgumentsSDK {
  @ValidAddress()
  @AddressApiProperty
  address: string;

  @ApiProperty({ example: 1 })
  value: number;
}

export class BurnItemParsed extends TokenId implements BurnItemArgumentsSDK {
  @ValidAddress()
  @AddressApiProperty
  address: string;

  @ApiProperty({ example: 1 })
  value: number;
}

export class BurnItemResponse extends MutationResponse {
  @ApiProperty()
  parsed: BurnItemParsed;
}
