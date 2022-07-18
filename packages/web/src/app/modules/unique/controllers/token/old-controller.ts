import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Sdk } from '@unique-nft/sdk';
import { Cache } from 'cache-manager';
import { SdkValidationPipe } from '../../../../validation';
import { SdkExceptionsFilter } from '../../../../utils/exception-filter';
import { CreateTokenBody, TokenIdQuery } from './types';
import { TokenInfoResponse } from '../../../../types/unique-types';
import { UnsignedTxPayloadResponse } from '../../../../types/sdk-methods';
import { BaseTokenController } from './base-controller';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('token')
@Controller('token')
export class OldTokenController extends BaseTokenController {
  constructor(readonly sdk: Sdk, @Inject(CACHE_MANAGER) readonly cache: Cache) {
    super(sdk, cache);
  }

  @Get()
  @ApiResponse({ type: TokenInfoResponse })
  async getToken(@Query() args: TokenIdQuery): Promise<TokenInfoResponse> {
    const token = await this.sdk.tokens.get(args);

    if (token) return token;

    throw new NotFoundException(
      `no token with id ${args.collectionId} - ${args.tokenId}`,
    );
  }

  @Post()
  @ApiResponse({ type: UnsignedTxPayloadResponse })
  async createToken(
    @Body() args: CreateTokenBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.tokens.create(args);
  }
}
