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
import { ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import {
  BurnCollectionBody,
  CollectionIdQuery,
  CreateCollectionBody,
  TransferCollectionBody,
  UnsignedTxPayloadResponse,
} from '../types/sdk-methods';
import { CustomValidationPipe } from '../validation';
import { CollectionInfoResponse } from '../types/unique-types';

@UseFilters(SdkExceptionsFilter)
@ApiTags('collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  @UsePipes(new CustomValidationPipe({}))
  async getCollection(
    @Query() args: CollectionIdQuery,
  ): Promise<CollectionInfoResponse> {
    const collection = await this.sdk.collection.get(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @Post()
  @UsePipes(new CustomValidationPipe({}))
  async createCollection(
    @Body() args: CreateCollectionBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collection.create(args);
  }

  @Delete()
  @UsePipes(new CustomValidationPipe({}))
  async burnCollection(
    @Body() args: BurnCollectionBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collection.burn(args);
  }

  @Patch('transfer')
  @UsePipes(new CustomValidationPipe({}))
  async transferCollection(
    @Body() args: TransferCollectionBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collection.transfer(args);
  }
}
