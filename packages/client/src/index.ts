// eslint-disable-next-line max-classes-per-file
import Axios, { AxiosInstance } from 'axios';
import { Balance } from './sections/balance';
import { Extrinsics } from './sections/extrinsics';
import { Tokens } from './sections/tokens';
import {
  ClientParameters,
  Options,
  IExtrinsics,
  IBalance,
} from './types/interfaces';

export class Client {
  public instance: AxiosInstance;

  public readonly extrinsics: IExtrinsics = new Extrinsics(this);

  public readonly balance: IBalance = new Balance(this);

  public readonly tokens = new Tokens(this);

  public readonly defaults: Options = {
    baseUrl: '',
    signer: null,
  };

  public readonly params: ClientParameters;

  constructor(public readonly options: Options) {
    this.params = {
      maximumNumberOfStatusRequests:
        this.options.maximumNumberOfStatusRequests || 5,
      waitBetweenStatusRequestsInMs:
        this.options.waitBetweenStatusRequestsInMs || 5_000,
    };
    this.instance = Axios.create({
      baseURL: this.options.baseUrl,
    });
  }
}
