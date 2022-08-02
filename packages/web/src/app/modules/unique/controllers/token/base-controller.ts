import { Sdk } from '@unique-nft/sdk';
import {
  Body,
  CACHE_MANAGER,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Post,
  Query,
  Patch,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  TokenChildrenResult,
  TokenPropertiesResult,
} from '@unique-nft/sdk/tokens';
import { ApiResponse } from '@nestjs/swagger';
import {
  BurnTokenBody,
  DeleteTokenPropertiesBody,
  DeleteTokenPropertiesResponse,
  NestTokenBody,
  NestTokenResponse,
  SetTokenPropertiesBody,
  SetTokenPropertiesResponse,
  TokenId,
  TokenIdQuery,
  TokenParentResponse,
  TokenProperty,
  TopmostTokenOwnerResponse,
  TransferTokenBody,
  TransferTokenResponse,
  UnnestTokenBody,
  UnnestTokenResponse,
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

  @MutationMethod(Post('nest'), NestTokenBody, NestTokenResponse)
  nestToken(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.tokens.nest,
      cache: this.cache,
      sdk: this.sdk,
    };
  }

  @MutationMethod(Post('unnest'), UnnestTokenBody, UnnestTokenResponse)
  unnestToken(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.tokens.unnest,
      cache: this.cache,
      sdk: this.sdk,
    };
  }

  @Get('children')
  @ApiResponse({ type: TokenId, isArray: true })
  async tokenChildren(
    @Query() args: TokenIdQuery,
  ): Promise<TokenChildrenResult> {
    return this.sdk.tokens.children(args);
  }

  @Get('parent')
  @ApiResponse({ type: TokenParentResponse })
  async tokenParent(@Query() args: TokenIdQuery): Promise<TokenParentResponse> {
    const parent = await this.sdk.tokens.parent(args);

    if (parent) return parent;

    throw new NotFoundException(
      `no parent for token with id ${args.collectionId} - ${args.tokenId}`,
    );
  }

  @Get('topmost-owner')
  @ApiResponse({ type: TopmostTokenOwnerResponse })
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
  @ApiResponse({ type: TokenProperty, isArray: true })
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
