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
import { TokenInfoDto } from '../types/unique-types';
import {
  BurnTokenArgsDto,
  CreateTokenArgsDto,
  TokenIdArgDto,
  TransferTokenArgsDto,
  UnsignedTxPayloadDto,
} from '../types/sdk-methods';

@UseFilters(SdkExceptionsFilter)
@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getToken(@Query() args: TokenIdArgDto): Promise<TokenInfoDto> {
    const token = await this.sdk.token.get(args);

    if (token) return token;

    throw new NotFoundException(
      `no token with id ${args.collectionId} - ${args.tokenId}`,
    );
  }

  @Post()
  async createToken(
    @Body() args: CreateTokenArgsDto,
  ): Promise<UnsignedTxPayloadDto> {
    return this.sdk.token.create(args);
  }

  @Delete()
  async burnToken(
    @Body() args: BurnTokenArgsDto,
  ): Promise<UnsignedTxPayloadDto> {
    return this.sdk.token.burn(args);
  }

  @Patch('transfer')
  async transferToken(
    @Body() args: TransferTokenArgsDto,
  ): Promise<UnsignedTxPayloadDto> {
    return this.sdk.token.transfer(args);
  }
}
