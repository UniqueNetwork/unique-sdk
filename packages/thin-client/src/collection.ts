import { AxiosInstance } from 'axios';

export class Collection {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;

    // todo тут смотри, я бы отнаследовался от другого класса ... ща накидаю
  }

  async get(collectionId: number) { // а вот нет, у тебя должен быть один-в-один интерфейс с сдк
    // todo а значит await client.collections.get({ collectionId });
    // todo надо вытащить типизацию из сваггера и класть в пакетик
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
