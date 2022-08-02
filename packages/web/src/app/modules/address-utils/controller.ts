/* eslint-disable class-methods-use-this */
import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrossAccountId } from '@unique-nft/sdk/types';
import { UniqueUtils } from '@unique-nft/api';
import { Sdk } from '@unique-nft/sdk';

import { TokenIdQuery } from '../unique/controllers/token';
import { SdkValidationPipe } from '../../validation';
import {
  AddressQuery,
  AddressWithPrefixQuery,
  CrossAccountResponse,
  EthereumAddressQuery,
} from './types';

@UsePipes(SdkValidationPipe)
@ApiTags('address-utils')
@Controller('address-utils')
export class AddressUtilsController {
  constructor(private readonly sdk: Sdk) {}

  @Get('nesting/ids-to-address')
  @CrossAccountResponse
  nestingTokenIdToAddress(
    @Query()
    { collectionId, tokenId }: TokenIdQuery,
  ) {
    const address = UniqueUtils.Address.nesting.idsToAddress(
      collectionId,
      tokenId,
    );

    return UniqueUtils.Address.to.crossAccountId(address);
  }

  @Get('nesting/address-to-ids')
  nestingAddressToCollection(
    @Query()
    { address }: AddressQuery,
  ): TokenIdQuery {
    return UniqueUtils.Address.nesting.addressToIds(address);
  }

  @Get('mirror/substrate-to-ethereum')
  @CrossAccountResponse
  substrateToEthereum(
    @Query()
    { address }: AddressQuery,
  ): CrossAccountId {
    const result = UniqueUtils.Address.mirror.substrateToEthereum(address);

    return UniqueUtils.Address.to.crossAccountId(result);
  }

  @Get('mirror/ethereum-to-substrate')
  @CrossAccountResponse
  ethereumToSubstrate(
    @Query()
    { address }: EthereumAddressQuery,
  ): CrossAccountId {
    const result = UniqueUtils.Address.mirror.ethereumToSubstrate(address);

    return UniqueUtils.Address.to.crossAccountId(result);
  }

  @Get('normalize')
  @CrossAccountResponse
  normalize(@Query() query: AddressWithPrefixQuery): CrossAccountId {
    const { address, ss58prefix = this.sdk.api.registry.chainSS58 } = query;
    UniqueUtils.Address.validate.substrateAddress(address);

    const normalized = UniqueUtils.Address.normalize.substrateAddress(
      address,
      ss58prefix,
    );

    return UniqueUtils.Address.to.crossAccountId(normalized);
  }
}
