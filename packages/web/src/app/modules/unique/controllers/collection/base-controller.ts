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
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Sdk } from '@unique-nft/sdk';
import {
  CollectionPropertiesResult,
  PropertyPermissionsResult,
} from '@unique-nft/sdk/tokens';
import { ApiResponse } from '@nestjs/swagger';
import { UnsignedTxPayloadResponse } from '../../../../types/sdk-methods';
import { EffectiveCollectionLimitsResponse } from '../../../../types/unique-types';
import {
  SetPropertyPermissionsResponse,
  CollectionIdQuery,
  BurnCollectionBody,
  SetCollectionLimitsBody,
  TransferCollectionBody,
  SetCollectionPropertiesBody,
  DeleteCollectionPropertiesBody,
  SetPropertyPermissionsBody,
  SetCollectionPropertiesResponse,
  DeleteCollectionPropertiesResponse,
  CollectionProperty,
  PropertyKeyPermission,
} from './types';
import {
  MutationMethod,
  MutationMethodOptions,
} from '../../../../decorators/mutation-method';

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
  @ApiResponse({ type: CollectionProperty, isArray: true })
  async collectionProperties(
    @Query() args: CollectionIdQuery,
  ): Promise<CollectionPropertiesResult> {
    return this.sdk.collections.properties(args);
  }

  @MutationMethod(
    Post('properties'),
    SetCollectionPropertiesBody,
    SetCollectionPropertiesResponse,
  )
  setCollectionProperties(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.collections.setProperties,
      cache: this.cache,
      sdk: this.sdk,
    };
  }

  @MutationMethod(
    Delete('properties'),
    DeleteCollectionPropertiesBody,
    DeleteCollectionPropertiesResponse,
  )
  deleteCollectionProperties(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.collections.deleteProperties,
      cache: this.cache,
      sdk: this.sdk,
    };
  }

  @Get('property-permissions')
  @ApiResponse({ type: PropertyKeyPermission, isArray: true })
  async propertyPermissions(
    @Query() args: CollectionIdQuery,
  ): Promise<PropertyPermissionsResult> {
    return this.sdk.collections.propertyPermissions(args);
  }

  @MutationMethod(
    Post('property-permissions'),
    SetPropertyPermissionsBody,
    SetPropertyPermissionsResponse,
  )
  setPropertyPermissions(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.collections.setPropertyPermissions,
      cache: this.cache,
      sdk: this.sdk,
    };
  }
}
