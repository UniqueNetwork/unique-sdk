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
} from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import {
  BurnCollectionArgsDto,
  CollectionIdArgDto,
  CreateCollectionArgsDto,
  TransferCollectionArgsDto,
  UnsignedTxPayloadDto,
} from '../types/sdk-methods';
import { validate } from '../validation';
import { CollectionInfoDto } from '../types/unique-types';

@UseFilters(SdkExceptionsFilter)
@ApiTags('collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getCollection(
    @Query() args: CollectionIdArgDto,
  ): Promise<CollectionInfoDto> {
    const collection = await this.sdk.collection.get(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @Post()
  async createCollection(
    @Body() args: CreateCollectionArgsDto,
  ): Promise<UnsignedTxPayloadDto> {
    await validate(args, CreateCollectionArgsDto);
    return this.sdk.collection.create(args);
  }

  @Delete()
  async burnCollection(
    @Body() args: BurnCollectionArgsDto,
  ): Promise<UnsignedTxPayloadDto> {
    return this.sdk.collection.burn(args);
  }

  @Patch('transfer')
  async transferCollection(
    @Body() args: TransferCollectionArgsDto,
  ): Promise<UnsignedTxPayloadDto> {
    return this.sdk.collection.transfer(args);
  }
}
