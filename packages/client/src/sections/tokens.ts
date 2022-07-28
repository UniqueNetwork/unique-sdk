import { Mutation } from '../classes/mutation';
import { Section } from '../classes/section';
import { CreateTokenNewDto, TokenId } from '../types/api';

export class Tokens extends Section {
  public readonly path = 'token-new';

  public readonly baseUrl = `${this.client.options.baseUrl}/${this.path}`;

  public readonly createToken = new Mutation<CreateTokenNewDto, TokenId>(
    this.client,
    'POST',
    this.path,
  );
}
