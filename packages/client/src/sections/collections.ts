import { Mutation } from '../classes/mutation';
import { Section } from '../classes/section';
import {
  CollectionInfoWithSchemaResponse,
  CreateCollectionNewRequest,
  CreateCollectionParsed,
  SetCollectionLimitsBody,
  SetCollectionLimitsResponse,
} from '../types';

export class Collections extends Section {
  public readonly path = 'collection-new';

  public readonly baseUrl = `${this.client.options.baseUrl}/${this.path}`;

  public readonly creation = new Mutation<
    CreateCollectionNewRequest,
    CreateCollectionParsed
  >(this.client, 'POST', this.path);

  public readonly setLimits = new Mutation<
    SetCollectionLimitsBody,
    SetCollectionLimitsResponse
  >(this.client, 'POST', this.path);

  async get(args: {
    collectionId: number;
  }): Promise<CollectionInfoWithSchemaResponse> {
    const response = await this.client.instance({
      method: 'GET',
      baseURL: this.baseUrl,
      url: '',
      params: { collectionId: args.collectionId },
    });
    return response.data;
  }
}
