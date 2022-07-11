/* eslint-disable max-classes-per-file */
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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../../../utils/exception-filter';
import {
  BurnCollectionBody,
  CollectionIdQuery,
  CreateCollectionBody,
  SetCollectionLimitsBody,
  TransferCollectionBody,
  UnsignedTxPayloadResponse,
} from '../../../types/sdk-methods';
import { SdkValidationPipe } from '../../../validation';
import {
  CollectionInfoResponse,
  CollectionInfoWithSchemaResponse,
  EffectiveCollectionLimitsResponse,
} from '../../../types/unique-types';
import { CreateCollectionNewRequest } from '../../../types/collection-requests';

export class BaseCollectionController {
  constructor(readonly sdk: Sdk) {}

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

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('collection')
@Controller('collection')
export class CollectionController extends BaseCollectionController {
  constructor(sdk: Sdk) {
    super(sdk);
  }

  @Get()
  async getCollection(
    @Query() args: CollectionIdQuery,
  ): Promise<CollectionInfoResponse> {
    const collection = await this.sdk.collections.get(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @Post()
  async createCollection(
    @Body() args: CreateCollectionBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collections.creation.build(args);
  }
}

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('collection-new')
@Controller('collection-new')
export class NewCollectionController extends BaseCollectionController {
  constructor(sdk: Sdk) {
    super(sdk);
  }

  @Get()
  async getCollectionNew(
    @Query() args: CollectionIdQuery,
  ): Promise<CollectionInfoWithSchemaResponse> {
    const collection = await this.sdk.collections.get_new(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @Post()
  @ApiBody({ type: CreateCollectionNewRequest })
  async createCollectionNew(
    @Body() args: CreateCollectionNewRequest,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collections.creation_new.build(args);
  }
}
