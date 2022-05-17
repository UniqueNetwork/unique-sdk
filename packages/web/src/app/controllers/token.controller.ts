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
import {
  BurnTokenArgs,
  CreateTokenArgs,
  TokenIdArg,
  TransferTokenArgs,
} from '@unique-nft/sdk/types';
import { ApiTags } from '@nestjs/swagger';
import { UnsignedTxPayload } from '@unique-nft/sdk/extrinsics';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  async getToken(@Query() args: TokenIdArg): Promise<any> {
    // todo fix any
    const token = await this.sdk.query.token(args);

    if (token) return token;

    throw new NotFoundException(
      `no token with id ${args.collectionId} - ${args.tokenId}`,
    );
  }

  @Post()
  async createToken(@Body() args: CreateTokenArgs): Promise<UnsignedTxPayload> {
    return this.sdk.token.create(args);
  }

  @Delete()
  async burnToken(@Query() args: BurnTokenArgs): Promise<UnsignedTxPayload> {
    return this.sdk.token.burn(args);
  }

  @Patch('transfer')
  async transferToken(
    @Body() args: TransferTokenArgs,
  ): Promise<UnsignedTxPayload> {
    return this.sdk.token.transfer(args);
  }
}
