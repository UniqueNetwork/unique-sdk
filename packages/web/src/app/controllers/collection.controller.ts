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
  ValidationPipe,
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
import { validate } from '../validation';
import { CollectionInfoResponse } from '../types/unique-types';

@UseFilters(SdkExceptionsFilter)
@ApiTags('collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async getCollection(
    @Query() args: CollectionIdQuery,
  ): Promise<CollectionInfoResponse> {
    const collection = await this.sdk.collection.get(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @Post()
  async createCollection(
    @Body() args: CreateCollectionBody,
  ): Promise<UnsignedTxPayloadResponse> {
    await validate(args, CreateCollectionBody);
    return this.sdk.collection.create(args);
  }

  @Delete()
  async burnCollection(
    @Body() args: BurnCollectionBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collection.burn(args);
  }

  @Patch('transfer')
  async transferCollection(
    @Body() args: TransferCollectionBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collection.transfer(args);
  }
}
