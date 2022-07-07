import { CollectionClient } from './collections';

describe('collection', () => {
  let collectionClient: any;

  beforeAll(async () => {
    collectionClient = new CollectionClient(
      'http://localhost:3000/',
      '//Alice',
    );
  });

  it('get collection', async () => {
    const response: { data: { id: number } } = await collectionClient.get(1);
    expect(response.data.id).toEqual(1);
  });
});
