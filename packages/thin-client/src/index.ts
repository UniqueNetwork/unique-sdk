// eslint-disable-next-line max-classes-per-file
import Axios, { AxiosInstance } from 'axios';
import { Balance } from './sections/Balance';
import { Extrinsics } from './sections/Extrinsics';

export interface Options {
  baseUrl: string;
  signer: any;
  maximumNumberOfStatusRequests?: number;
  waitBetweenStatusRequestsInMs?: number;
}

export class ThinClient {
  public instance: AxiosInstance;

  public readonly extrinsics = new Extrinsics(this);

  public readonly balance = new Balance(this);

  public readonly defaults: Options = {
    baseUrl: '',
    signer: null,
  };

  public readonly params: {
    maximumNumberOfStatusRequests: number;
    waitBetweenStatusRequestsInMs: number;
  };

  constructor(public readonly options: Options) {
    this.params = {
      maximumNumberOfStatusRequests:
        this.options.maximumNumberOfStatusRequests || 5,
      waitBetweenStatusRequestsInMs:
        this.options.waitBetweenStatusRequestsInMs || 5_000,
    };
    this.instance = Axios.create({
      baseURL: this.options.baseUrl,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
