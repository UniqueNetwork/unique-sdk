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
import { ExtrinsicBuildResponse, TokenGetRequest } from '../dto';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import {
  BurnTokenRequest,
  CreateTokenRequest,
  TransferTokenRequest,
} from '../dto/token.dto';

@UseFilters(SdkExceptionsFilter)
@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getToken(@Query() args: TokenGetRequest): Promise<any> {
    const token = await this.sdk.query.token(args);

    if (token) return token;

    throw new NotFoundException(
      `no token with id ${args.collectionId} - ${args.tokenId}`,
    );
  }

  @Post()
  async createToken(
    @Body() args: CreateTokenRequest,
  ): Promise<ExtrinsicBuildResponse> {
    return this.sdk.collection.create(args);
  }

  @Delete()
  async burnToken(
    @Body() args: BurnTokenRequest,
  ): Promise<ExtrinsicBuildResponse> {
    return this.sdk.token.burn(args);
  }

  @Patch('transfer')
  async transferToken(
    @Body() args: TransferTokenRequest,
  ): Promise<ExtrinsicBuildResponse> {
    return this.sdk.token.transfer(args);
  }
}
