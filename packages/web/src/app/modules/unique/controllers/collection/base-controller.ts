import {
  Body,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
  Query,
  Inject,
  CACHE_MANAGER,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Sdk } from '@unique-nft/sdk';
import {
  CollectionPropertiesResult,
  PropertyPermissionsResult,
} from '@unique-nft/sdk/tokens';
import { UnsignedTxPayloadResponse } from '../../../../types/sdk-methods';
import { EffectiveCollectionLimitsResponse } from '../../../../types/unique-types';
import {
  CollectionIdQuery,
  BurnCollectionBody,
  SetCollectionLimitsBody,
  TransferCollectionBody,
  SetCollectionPropertiesBody,
  DeleteCollectionPropertiesBody,
  SetTokenPropertyPermissionsBody,
} from './types';

export class BaseCollectionController {
  constructor(
    readonly sdk: Sdk,
    @Inject(CACHE_MANAGER) readonly cache: Cache,
  ) {}

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

  @Get('properties')
  async collectionProperties(
    @Query() args: CollectionIdQuery,
  ): Promise<CollectionPropertiesResult> {
    return this.sdk.collections.properties(args);
  }

  @Post('properties')
  @HttpCode(HttpStatus.OK)
  async setCollectionProperties(
    @Body() args: SetCollectionPropertiesBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collections.setProperties.build(args);
  }

  @Delete('properties')
  async deleteCollectionProperties(
    @Body() args: DeleteCollectionPropertiesBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collections.deleteProperties.build(args);
  }

  @Get('property-permissions')
  async propertyPermissions(
    @Query() args: CollectionIdQuery,
  ): Promise<PropertyPermissionsResult> {
    return this.sdk.collections.propertyPermissions(args);
  }

  @Post('property-permissions')
  @HttpCode(HttpStatus.OK)
  async setTokenPropertyPermissions(
    @Body() args: SetTokenPropertyPermissionsBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.collections.setPropertyPermissions.build(args);
  }
}
