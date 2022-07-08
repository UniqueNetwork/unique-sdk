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
} from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MutationMethodWrap } from '@unique-nft/sdk/extrinsics';
import {
  CollectionIdArguments,
  CreateCollectionArguments,
} from '@unique-nft/sdk/tokens';
import { SdkExceptionsFilter } from '../../../utils/exception-filter';
import {
  BurnCollectionBody,
  CollectionIdQuery,
  CollectionIdResponse,
  CreateCollectionBody,
  SetCollectionLimitsBody,
  TransferCollectionBody,
  UnsignedTxPayloadResponse,
} from '../../../types/sdk-methods';
import { SdkValidationPipe } from '../../../validation';
import { MutationMethod } from '../../../decorators/mutation-method';
import {
  CollectionInfoResponse,
  EffectiveCollectionLimitsResponse,
} from '../../../types/unique-types';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getCollection(
    @Query() args: CollectionIdQuery,
  ): Promise<CollectionInfoResponse> {
    const collection = await this.sdk.collections.get(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @MutationMethod(Post(), CreateCollectionBody, CollectionIdResponse)
  @ApiOperation({
    description: 'My description',
  })
  createCollectionMutation(): MutationMethodWrap<
    CreateCollectionArguments,
    CollectionIdArguments
  > {
    return this.sdk.collections.creation;
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
