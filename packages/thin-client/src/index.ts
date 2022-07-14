// eslint-disable-next-line max-classes-per-file
import Axios, { AxiosInstance } from 'axios';
import { Balance } from './classes/Balance';
import { Extrinsics } from './classes/Extrinsics';

export class ThinClient {
  public instance: AxiosInstance;

  public readonly extrinsics = new Extrinsics(this);

  public readonly balance = new Balance(this);

  public signer: any;

  constructor(
    public readonly options: {
      url: string;
    },
    signer: any, // todo в options наверно надо, подумой
  ) {
    this.instance = Axios.create({
      baseURL: this.options.url,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    this.signer = signer;
  }
}
