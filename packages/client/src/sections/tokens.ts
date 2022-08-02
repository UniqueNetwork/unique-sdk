import { Mutation } from '../classes/mutation';
import { Section } from '../classes/section';
import {
  CreateTokenNewDto,
  TokenId,
  UniqueTokenDecodedResponse,
  TokenParentResponse,
  TopmostTokenOwnerResponse,
  NestTokenBody,
  UnnestTokenBody,
} from '../types';

export class Tokens extends Section {
  public readonly path = 'token-new';

  public readonly baseUrl = `${this.client.options.baseUrl}/${this.path}`;

  public readonly create = new Mutation<CreateTokenNewDto, TokenId>(
    this.client,
    'POST',
    this.path,
  );

  async get(args: TokenId): Promise<UniqueTokenDecodedResponse> {
    const response = await this.client.instance({
      method: 'GET',
      baseURL: this.baseUrl,
      url: '',
      params: { collectionId: args.collectionId, tokenId: args.tokenId },
    });
    return response.data;
  }

  async children({ collectionId, tokenId }: TokenId): Promise<TokenId[]> {
    const response = await this.client.instance({
      method: 'GET',
      baseURL: this.baseUrl,
      url: 'children',
      params: { collectionId, tokenId },
    });

    return response.data;
  }

  async parent({
    collectionId,
    tokenId,
  }: TokenId): Promise<TokenParentResponse> {
    const response = await this.client.instance({
      method: 'GET',
      baseURL: this.baseUrl,
      url: 'parent',
      params: { collectionId, tokenId },
    });

    return response.data;
  }

  async topmostOwner({
    collectionId,
    tokenId,
  }: TokenId): Promise<TopmostTokenOwnerResponse> {
    const response = await this.client.instance({
      method: 'GET',
      baseURL: this.baseUrl,
      url: 'topmost-owner',
      params: { collectionId, tokenId },
    });

    return response.data;
  }

  public readonly nest = new Mutation<NestTokenBody, TokenId>(
    this.client,
    'POST',
    `${this.path}/nest`,
  );

  public readonly unnest = new Mutation<UnnestTokenBody, TokenId>(
    this.client,
    'POST',
    `${this.path}/unnest`,
  );
}
