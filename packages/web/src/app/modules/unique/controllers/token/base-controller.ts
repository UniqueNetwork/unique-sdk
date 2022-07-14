import { Sdk } from '@unique-nft/sdk';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  BurnTokenBody,
  DeleteTokenPropertiesBody,
  NestTokenBody,
  SetTokenPropertiesBody,
  TokenChildrenResponse,
  TokenIdQuery,
  TokenParentResponse,
  TopmostTokenOwnerResponse,
  TransferTokenBody,
  UnnestTokenBody,
} from './types';
import { UnsignedTxPayloadResponse } from '../../../../types/sdk-methods';

export class BaseTokenController {
  constructor(readonly sdk: Sdk) {}

  @Delete()
  async burnToken(
    @Body() args: BurnTokenBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.tokens.burn(args);
  }

  @Patch('transfer')
  async transferToken(
    @Body() args: TransferTokenBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.tokens.transfer(args);
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
  async tokenProperties(@Query() args: TokenIdQuery) {
    return this.sdk.tokens.properties(args);
  }

  @Post('properties')
  @HttpCode(HttpStatus.OK)
  async setCollectionProperties(
    @Body() args: SetTokenPropertiesBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.tokens.setProperties.build(args);
  }

  @Delete('properties')
  async deleteCollectionProperties(
    @Body() args: DeleteTokenPropertiesBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.tokens.deleteProperties.build(args);
  }
}
