// eslint-disable-next-line max-classes-per-file
import Axios, { AxiosInstance } from 'axios';
import { Balance } from './sections/Balance';
import { Extrinsics } from './sections/Extrinsics';

export class ThinClient {
  public instance: AxiosInstance;

  public readonly extrinsics = new Extrinsics(this);

  public readonly balance = new Balance(this);

  constructor(
    public readonly options: {
      baseUrl: string;
      signer: any;
      defaults?: any;
    },
  ) {
    this.instance = Axios.create({
      baseURL: this.options.baseUrl,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
