/* eslint-disable max-classes-per-file */
import {
  BurnTokenArguments,
  NestTokenArguments,
  TokenChildrenResult,
  TokenIdArguments,
  TokenParentResult,
  TopmostTokenOwnerResult,
  TransferTokenArguments,
  UnnestTokenArguments,
} from '@unique-nft/sdk/tokens';
import { ApiProperty } from '@nestjs/swagger';
import {
  Address,
  AnyObject,
  CreateTokenArguments,
} from '@unique-nft/sdk/types';
import { IsInt, IsOptional, IsPositive, ValidateNested } from 'class-validator';
import { ValidAddress } from '../../../../validation';
import { CollectionId } from '../collection';
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

export class BurnTokenBody extends TokenId implements BurnTokenArguments {
  @ValidAddress()
  @AddressApiProperty
  address: string;
}

export class TransferTokenBody
  extends TokenId
  implements TransferTokenArguments
{
  @ValidAddress()
  @AddressApiProperty
  from: string;

  @ValidAddress()
  @AddressApiProperty
  to: string;
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

export class TokenChildrenResponse {
  @ApiProperty({ type: TokenId, isArray: true })
  children: TokenChildrenResult;
}

export class TokenParentResponse extends TokenId implements TokenParentResult {
  @ApiProperty({ example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm' })
  address: Address;
}

export class TopmostTokenOwnerResponse {
  @ApiProperty({ example: 'unjq56sK9skTMR1MyPLsDFXkQdRNNrD1gzE4wRJSYm2k6GjJn' })
  topmostOwner: TopmostTokenOwnerResult;
}