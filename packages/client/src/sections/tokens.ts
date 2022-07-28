import { Mutation } from '../classes/mutation';
import { Section } from '../classes/section';
import {
  CreateTokenNewDto,
  TokenId,
  UniqueTokenDecodedResponse,
} from '../types/api';

export class Tokens extends Section {
  public readonly path = 'token-new';

  public readonly baseUrl = `${this.client.options.baseUrl}/${this.path}`;

  public readonly createToken = new Mutation<CreateTokenNewDto, TokenId>(
    this.client,
    'POST',
    this.path,
  );

  async tokenById(args: TokenId): Promise<UniqueTokenDecodedResponse> {
    const response = await this.client.instance({
      method: 'GET',
      baseURL: this.baseUrl,
      url: '',
      params: { collectionId: args.collectionId, tokenId: args.tokenId },
    });
    return response.data;
  }
}
