import { Mutation } from '../classes/mutation';
import { Section } from '../classes/section';
import {
  TokenProperty,
  TokenId,
  SetTokenPropertiesBody,
  TokenPropertySetEvent,
  DeleteTokenPropertiesBody,
  TokenPropertyDeletedEvent,
} from '../types/api';
import { ITokens } from '../types/interfaces';

export class Tokens extends Section implements ITokens {
  public readonly path = 'token-new';

  public readonly baseUrl = `${this.client.options.baseUrl}/${this.path}`;

  public readonly setProperties = new Mutation<
    SetTokenPropertiesBody,
    TokenPropertySetEvent[]
  >(this.client, 'POST', `${this.path}/properties`);

  public readonly deleteProperties = new Mutation<
    DeleteTokenPropertiesBody,
    TokenPropertyDeletedEvent[]
  >(this.client, 'DELETE', `${this.path}/properties`);

  async properties({
    collectionId,
    tokenId,
  }: TokenId): Promise<TokenProperty[]> {
    const response = await this.client.instance({
      method: 'GET',
      baseURL: this.baseUrl,
      url: 'properties',
      params: { collectionId, tokenId },
    });
    return response.data;
  }
}
