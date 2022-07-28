import { Mutation } from '../classes/mutation';
import { Section } from '../classes/section';
import {
  CollectionInfoWithSchemaResponse,
  CreateCollectionNewRequest,
  CreateCollectionParsed,
} from '../types/api';

export class Collections extends Section {
  public readonly path = 'collection-new';

  public readonly baseUrl = `${this.client.options.baseUrl}/${this.path}`;

  public readonly createCollectionEx = new Mutation<
    CreateCollectionNewRequest,
    CreateCollectionParsed
  >(this.client, 'POST', this.path);

  async collectionByIdFn(args: {
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
