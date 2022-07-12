import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Sdk } from '@unique-nft/sdk';
import { SdkValidationPipe } from '../../../../validation';
import { SdkExceptionsFilter } from '../../../../utils/exception-filter';
import { TokenIdQuery } from './types';
import {
  CreateTokenNewDto,
  UniqueTokenDecodedResponse,
} from '../unique-schema';
import { UnsignedTxPayloadResponse } from '../../../../types/sdk-methods';
import { BaseTokenController } from './base-controller';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('token-new')
@Controller('token-new')
export class NewTokenController extends BaseTokenController {
  constructor(readonly sdk: Sdk) {
    super(sdk);
  }

  @Get()
  @ApiResponse({ type: UniqueTokenDecodedResponse })
  async getTokenNew(
    @Query() args: TokenIdQuery,
  ): Promise<UniqueTokenDecodedResponse> {
    const token = await this.sdk.tokens.get_new(args);

    if (token) return token;

    throw new NotFoundException(
      `no token with id ${args.collectionId} - ${args.tokenId}`,
    );
  }

  @Post()
  @ApiResponse({ type: UnsignedTxPayloadResponse })
  async createToken(
    @Body() args: CreateTokenNewDto,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.tokens.create_new.build(args);
  }
}
