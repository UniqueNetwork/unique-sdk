import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';
import { Cache } from 'cache-manager';
import { SdkValidationPipe } from '../../../../validation';
import { SdkExceptionsFilter } from '../../../../utils/exception-filter';
import {
  MutationMethod,
  MutationMethodOptions,
} from '../../../../decorators/mutation-method';
import {
  AddTokensArgsDto,
  AddTokensResultDto,
  CreateFungibleCollectionRequest,
  FungibleCollectionInfoDto,
  GetFungibleBalanceArgsRequest,
  TransferTokensArgsDto,
  TransferTokensResultDto,
} from './types';
import { CollectionIdQuery, CreateCollectionResponse } from '../collection';
import { BalanceResponse } from '../../../../types/sdk-methods';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('fungible')
@Controller('fungible')
export class FungibleController {
  constructor(
    readonly sdk: Sdk,
    @Inject(CACHE_MANAGER) readonly cache: Cache,
  ) {}

  @Get('collection')
  @ApiResponse({ type: FungibleCollectionInfoDto })
  async getCollection(
    @Query() args: CollectionIdQuery,
  ): Promise<FungibleCollectionInfoDto> {
    const collection = await this.sdk.fungible.getCollection(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @Get('balance')
  @ApiResponse({ type: BalanceResponse })
  async getBalance(
    @Query() args: GetFungibleBalanceArgsRequest,
  ): Promise<BalanceResponse> {
    return this.sdk.fungible.getBalance(args);
  }

  @MutationMethod(
    Post('collection'),
    CreateFungibleCollectionRequest,
    CreateCollectionResponse,
  )
  @ApiOperation({
    description: 'Create a new fungible collection',
  })
  createCollectionMutation(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.fungible.createCollection,
      cache: this.cache,
    };
  }

  @MutationMethod(Post('tokens'), AddTokensArgsDto, AddTokensResultDto)
  @ApiOperation({
    description: 'Add tokens to fungible collection',
  })
  addTokensMutation(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.fungible.addTokens,
      cache: this.cache,
    };
  }

  @MutationMethod(
    Post('tokens/transfer'),
    TransferTokensArgsDto,
    TransferTokensResultDto,
  )
  @ApiOperation({
    description: 'Transfer tokens of fungible collection',
  })
  transferTokensMutation(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.fungible.transferTokens,
      cache: this.cache,
    };
  }
}
