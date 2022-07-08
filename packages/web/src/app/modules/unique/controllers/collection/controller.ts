import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
  Query,
  UseFilters,
  UsePipes,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Sdk } from '@unique-nft/sdk';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CollectionIdArguments } from '@unique-nft/sdk/tokens';
import { SdkExceptionsFilter } from '../../../../utils/exception-filter';
import {
  BurnCollectionBody,
  CollectionIdQuery,
  SetCollectionLimitsBody,
  TransferCollectionBody,
  UnsignedTxPayloadResponse,
} from '../../../../types/sdk-methods';
import { SdkValidationPipe } from '../../../../validation';
import {
  MutationMethod,
  MutationMethodOptions,
} from '../../../../decorators/mutation-method';
import {
  CollectionInfoResponse,
  EffectiveCollectionLimitsResponse,
} from '../../../../types/unique-types';
import { CreateCollectionBody, CreateCollectionResponse } from './types';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('collection')
@Controller('collection')
export class CollectionController {
  constructor(
    private readonly sdk: Sdk,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  @Get()
  async getCollection(
    @Query() args: CollectionIdQuery,
  ): Promise<CollectionInfoResponse> {
    const collection = await this.sdk.collections.get(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @MutationMethod(Post(), CreateCollectionBody, CreateCollectionResponse)
  @ApiOperation({
    description: 'Create a new collection',
  })
  createCollectionMutation(): MutationMethodOptions<
    CreateCollectionBody,
    CollectionIdArguments
  > {
    return {
      mutationMethod: this.sdk.collections.creation,
      cache: this.cache,
    };
  }

  @Get('limits')
  async effectiveCollectionLimits(
    @Query() args: CollectionIdQuery,
  ): Promise<EffectiveCollectionLimitsResponse> {
    const collection = await this.sdk.collections.getLimits(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @Post('set-limits')
  async setCollectionLimits(
    @Body() args: SetCollectionLimitsBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collections.setLimits.build(args);
  }

  @Delete()
  async burnCollection(
    @Body() args: BurnCollectionBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collections.burn(args);
  }

  @Patch('transfer')
  async transferCollection(
    @Body() args: TransferCollectionBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collections.transfer(args);
  }
}
