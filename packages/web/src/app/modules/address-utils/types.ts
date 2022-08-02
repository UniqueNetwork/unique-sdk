/* eslint-disable max-classes-per-file */
import {
  ApiExtraModels,
  ApiProperty,
  ApiResponse,
  refs,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  AddressApiProperty,
  EthereumAddressApiProperty,
} from '../../types/sdk-methods';
import {
  EthereumAddress,
  SubstrateAddress,
} from '../unique/controllers/unique-schema/shared';

export class AddressQuery {
  @AddressApiProperty
  address: string;
}

export class EthereumAddressQuery {
  @EthereumAddressApiProperty
  address: string;
}

export class AddressWithPrefixQuery extends AddressQuery {
  @ApiProperty({ required: false })
  ss58prefix?: number;
}

export const CrossAccountResponse = applyDecorators(
  ApiResponse({
    schema: { oneOf: refs(SubstrateAddress, EthereumAddress) },
  }),
  ApiExtraModels(SubstrateAddress, EthereumAddress),
);
