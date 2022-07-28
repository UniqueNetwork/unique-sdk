import { Mutation } from '../classes/mutation';
import { Section } from '../classes/section';
import {
  CollectionPropertySetEvent,
  SetCollectionPropertiesBody,
  DeleteCollectionPropertiesBody,
  CollectionPropertyDeletedEvent,
  CollectionProperty,
} from '../types/api';
import { ICollections } from '../types/interfaces';

export class Collections extends Section implements ICollections {
  public readonly path = 'collection-new';

  public readonly baseUrl = `${this.client.options.baseUrl}/${this.path}`;

  public readonly setProperties = new Mutation<
    SetCollectionPropertiesBody,
    CollectionPropertySetEvent[]
  >(this.client, 'POST', `${this.path}/properties`);

  public readonly deleteProperties = new Mutation<
    DeleteCollectionPropertiesBody,
    CollectionPropertyDeletedEvent[]
  >(this.client, 'DELETE', `${this.path}/properties`);

  async properties({
    collectionId,
  }: {
    collectionId: number;
  }): Promise<CollectionProperty[]> {
    const response = await this.client.instance({
      method: 'GET',
      baseURL: this.baseUrl,
      url: 'properties',
      params: { collectionId },
    });
    return response.data;
  }
}
