import * as process from 'process';
import { Client } from './index';

describe('collection', () => {
  let client: any;

  beforeAll(async () => {
    client = new Client(
      process.env['API_URL'] || 'http://localhost:3000/',
      '//Alice',
    );
  });

  describe('get collection', () => {
    it('success', async () => {
      const response: { id: number } = await client.collection.get(1);
      expect(response.id).toEqual(1);
    });

    it('error', async () => {
      expect(client.collection.get(-1)).rejects.toThrow(Error);
    });
  });
});
