import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../../../utils/exception-filter';
import { TokenInfoResponse } from '../../../types/unique-types';
import {
  BurnTokenBody,
  CreateTokenBody,
  TokenIdQuery,
  TransferTokenBody,
  UnsignedTxPayloadResponse,
  NestTokenBody,
  UnnestTokenBody,
  TokenChildrenResponse,
  TokenParentResponse,
  TopmostTokenOwnerResponse,
} from '../../../types/sdk-methods';
import { SdkValidationPipe } from '../../../validation';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getToken(@Query() args: TokenIdQuery): Promise<TokenInfoResponse> {
    const token = await this.sdk.tokens.get(args);

    if (token) return token;

    throw new NotFoundException(
      `no token with id ${args.collectionId} - ${args.tokenId}`,
    );
  }

  @Post()
  async createToken(
    @Body() args: CreateTokenBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.tokens.create(args);
  }

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
}
