import {
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
import { TokenId, TokenIdQuery } from './types';
import {
  CreateTokenNewDto,
  UniqueTokenDecodedResponse,
} from '../unique-schema';
import { BaseTokenController } from './base-controller';
import {
  MutationMethod,
  MutationMethodOptions,
} from '../../../../decorators/mutation-method';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('token-new')
@Controller('token-new')
export class NewTokenController extends BaseTokenController {
  constructor(readonly sdk: Sdk, @Inject(CACHE_MANAGER) readonly cache: Cache) {
    super(sdk, cache);
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

  @MutationMethod(Post(), CreateTokenNewDto, TokenId)
  createNewTokenMutation(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.tokens.create_new,
      cache: this.cache,
      sdk: this.sdk,
    };
  }
}
