import Axios, { AxiosInstance } from 'axios';

export class CollectionClient {
  private baseUrl: string;

  private seed: string;

  private instance: AxiosInstance;

  constructor(baseUrl: string, seed: string) {
    this.baseUrl = `${baseUrl}`;
    this.seed = seed;
    this.instance = Axios.create({
      baseURL: this.baseUrl,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  async get(address: string) {
    try {
      return await this.instance.get('collection', {
        params: {
          address,
        },
      });
    } catch (e) {
      return { success: false };
    }
  }
}
