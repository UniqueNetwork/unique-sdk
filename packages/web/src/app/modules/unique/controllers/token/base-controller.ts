import { Sdk } from '@unique-nft/sdk';
import {
  Body,
  CACHE_MANAGER,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  Query,
  Patch,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TokenPropertiesResult } from '@unique-nft/sdk/tokens';
import {
  BurnTokenBody,
  DeleteTokenPropertiesBody,
  DeleteTokenPropertiesResponse,
  NestTokenBody,
  SetTokenPropertiesBody,
  SetTokenPropertiesResponse,
  TokenChildrenResponse,
  TokenIdQuery,
  TokenParentResponse,
  TopmostTokenOwnerResponse,
  TransferFromTokenBody,
  TransferTokenBody,
  TransferTokenResponse,
  UnnestTokenBody,
} from './types';
import { UnsignedTxPayloadResponse } from '../../../../types/sdk-methods';
import {
  MutationMethod,
  MutationMethodOptions,
} from '../../../../decorators/mutation-method';

export class BaseTokenController {
  constructor(
    readonly sdk: Sdk,
    @Inject(CACHE_MANAGER) readonly cache: Cache,
  ) {}

  @Delete()
  async burnToken(
    @Body() args: BurnTokenBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.tokens.burn(args);
  }

  @MutationMethod(Patch('transfer'), TransferTokenBody, TransferTokenResponse)
  transferToken(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.tokens.transfer,
      cache: this.cache,
      sdk: this.sdk,
    };
  }

  @MutationMethod(
    Patch('transfer-from'),
    TransferFromTokenBody,
    TransferTokenResponse,
  )
  transferFrom(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.tokens.transferFrom,
      cache: this.cache,
      sdk: this.sdk,
    };
  }

  @Post('nest')
  @HttpCode(HttpStatus.OK)
  async nestToken(
    @Body() args: NestTokenBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.tokens.nest.build(args);
  }

  @Post('unnest')
  @HttpCode(HttpStatus.OK)
  async unnestToken(
    @Body() args: UnnestTokenBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.tokens.unnest.build(args);
  }

  @Get('children')
  async tokenChildren(
    @Query() args: TokenIdQuery,
  ): Promise<TokenChildrenResponse> {
    const children = await this.sdk.tokens.children(args);

    return { children };
  }

  @Get('parent')
  async tokenParent(@Query() args: TokenIdQuery): Promise<TokenParentResponse> {
    const parent = await this.sdk.tokens.parent(args);

    if (parent) return parent;

    throw new NotFoundException(
      `no parent for token with id ${args.collectionId} - ${args.tokenId}`,
    );
  }

  @Get('topmost-owner')
  async topmostTokenOwner(
    @Query() args: TokenIdQuery,
  ): Promise<TopmostTokenOwnerResponse> {
    try {
      const topmostOwner = await this.sdk.tokens.topmostOwner(args);

      return { topmostOwner };
    } catch (e) {
      throw new NotFoundException(
        `no topmost owner for token with id ${args.collectionId} - ${args.tokenId}`,
      );
    }
  }

  @Get('properties')
  async tokenProperties(
    @Query() args: TokenIdQuery,
  ): Promise<TokenPropertiesResult> {
    return this.sdk.tokens.properties(args);
  }

  @MutationMethod(
    Post('properties'),
    SetTokenPropertiesBody,
    SetTokenPropertiesResponse,
  )
  setTokenProperties(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.tokens.setProperties,
      cache: this.cache,
      sdk: this.sdk,
    };
  }

  @MutationMethod(
    Delete('properties'),
    DeleteTokenPropertiesBody,
    DeleteTokenPropertiesResponse,
  )
  deleteTokenProperties(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.tokens.deleteProperties,
      cache: this.cache,
      sdk: this.sdk,
    };
  }
}
