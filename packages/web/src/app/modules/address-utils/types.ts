/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import {
  AddressApiProperty,
  EthereumAddressApiProperty,
} from '../../types/sdk-methods';

export class AddressDto {
  @AddressApiProperty
  address: string;
}

export class EthereumAddressDto {
  @EthereumAddressApiProperty
  address: string;
}

export class NestingAddressDto {
  @ApiProperty({
    description: 'collection and token id, encoded as ethereum address',
    example: '0xF8238ccFFF8ED887463Fd5e00000000100000001',
  })
  address: string;
}

export class AddressWithPrefixQuery extends AddressDto {
  @ApiProperty({ required: false })
  ss58prefix?: number;
}
