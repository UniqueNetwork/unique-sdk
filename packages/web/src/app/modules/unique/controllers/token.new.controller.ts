import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../../../utils/exception-filter';
import { TokenIdQuery } from '../../../types/sdk-methods';
import { SdkValidationPipe } from '../../../validation';
import { UniqueTokenDecodedResponse } from '../../../types/unique-schema';
import { TokenController } from './token.controller';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('token (with unique schema)')
@Controller('token-new')
export class TokenNewController extends TokenController {
  constructor(sdk: Sdk) {
    super(sdk);
  }

  @Get()
  async getTokenNew(
    @Query() args: TokenIdQuery,
  ): Promise<UniqueTokenDecodedResponse> {
    const token = await this.sdk.tokens.get_new(args);

    if (token) return token;

    throw new NotFoundException(
      `no token with id ${args.collectionId} - ${args.tokenId}`,
    );
  }
}
