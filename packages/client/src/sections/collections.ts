import { Mutation } from '../classes/mutation';
import { Section } from '../classes/section';
import {
  CollectionPropertySetEvent,
  SetCollectionPropertiesBody,
  DeleteCollectionPropertiesBody,
  CollectionPropertyDeletedEvent,
  CollectionProperty,
  SetPropertyPermissionsBody,
  PropertyPermissionSetEvent,
  PropertyKeyPermission,
  CollectionInfoWithSchemaResponse,
  CreateCollectionNewRequest,
  CreateCollectionParsed,
  ICollections,
} from '../types';

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

  public readonly setPropertyPermissions = new Mutation<
    SetPropertyPermissionsBody,
    PropertyPermissionSetEvent[]
  >(this.client, 'POST', `${this.path}/property-permissions`);

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

  async propertyPermissions({
    collectionId,
  }: {
    collectionId: number;
  }): Promise<PropertyKeyPermission[]> {
    const response = await this.client.instance({
      method: 'GET',
      baseURL: this.baseUrl,
      url: 'property-permissions',
      params: { collectionId },
    });

    return response.data;
  }

  public readonly creation = new Mutation<
    CreateCollectionNewRequest,
    CreateCollectionParsed
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
