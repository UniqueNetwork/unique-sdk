import { AxiosInstance } from 'axios';

export class Collection {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  async get(collectionId: number) {
    try {
      const collectionResponse = await this.instance.get('collection', {
        params: {
          collectionId,
        },
      });
      return collectionResponse.data;
    } catch (e) {
      throw new Error('Get collection error');
    }
  }
}
