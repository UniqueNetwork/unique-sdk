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
import { TokenInfoResponse } from '../types/unique-types';
import {
  BurnTokenBody,
  CreateTokenBody,
  TokenIdQuery,
  TransferTokenBody,
  UnsignedTxPayloadResponse,
} from '../types/sdk-methods';
import { SdkValidationPipe } from '../validation';

@UseFilters(SdkExceptionsFilter)
@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  @UsePipes(new SdkValidationPipe({}))
  async getToken(@Query() args: TokenIdQuery): Promise<TokenInfoResponse> {
    const token = await this.sdk.token.get(args);

    if (token) return token;

    throw new NotFoundException(
      `no token with id ${args.collectionId} - ${args.tokenId}`,
    );
  }

  @Post()
  @UsePipes(new SdkValidationPipe({}))
  async createToken(
    @Body() args: CreateTokenBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.token.create(args);
  }

  @Delete()
  @UsePipes(new SdkValidationPipe({}))
  async burnToken(
    @Body() args: BurnTokenBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.token.burn(args);
  }

  @Patch('transfer')
  @UsePipes(new SdkValidationPipe({}))
  async transferToken(
    @Body() args: TransferTokenBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.token.transfer(args);
  }
}
