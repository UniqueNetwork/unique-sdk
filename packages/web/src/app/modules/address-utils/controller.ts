/* eslint-disable class-methods-use-this */
import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UniqueUtils } from '@unique-nft/api';
import { Sdk } from '@unique-nft/sdk';

import { TokenIdQuery } from '../unique/controllers/token';
import { SdkValidationPipe } from '../../validation';
import {
  AddressDto,
  AddressWithPrefixQuery,
  EthereumAddressDto,
  NestingAddressDto,
} from './types';

@UsePipes(SdkValidationPipe)
@ApiTags('address-utils')
@Controller('address-utils')
export class AddressUtilsController {
  constructor(private readonly sdk: Sdk) {}

  @Get('nesting/ids-to-address')
  @ApiResponse({ type: NestingAddressDto })
  nestingTokenIdToAddress(
    @Query()
    { collectionId, tokenId }: TokenIdQuery,
  ): NestingAddressDto {
    const address = UniqueUtils.Address.nesting.idsToAddress(
      collectionId,
      tokenId,
    );

    return { address };
  }

  @Get('nesting/address-to-ids')
  @ApiResponse({ type: TokenIdQuery })
  nestingAddressToCollection(
    @Query()
    { address }: NestingAddressDto,
  ): TokenIdQuery {
    return UniqueUtils.Address.nesting.addressToIds(address);
  }

  @Get('mirror/substrate-to-ethereum')
  @ApiResponse({ type: EthereumAddressDto })
  substrateToEthereum(
    @Query()
    { address }: AddressDto,
  ): EthereumAddressDto {
    const ethereum = UniqueUtils.Address.mirror.substrateToEthereum(address);

    return { address: ethereum };
  }

  @Get('mirror/ethereum-to-substrate')
  @ApiResponse({ type: AddressDto })
  ethereumToSubstrate(
    @Query()
    { address }: EthereumAddressDto,
  ): AddressDto {
    const substrate = UniqueUtils.Address.mirror.ethereumToSubstrate(address);

    return this.normalize({ address: substrate });
  }

  @Get('normalize')
  @ApiResponse({ type: AddressDto })
  normalize(@Query() query: AddressWithPrefixQuery): AddressDto {
    const { address, ss58prefix = this.sdk.api.registry.chainSS58 } = query;
    UniqueUtils.Address.validate.substrateAddress(address);

    const normalized = UniqueUtils.Address.normalize.substrateAddress(
      address,
      ss58prefix,
    );

    return { address: normalized };
  }
}
