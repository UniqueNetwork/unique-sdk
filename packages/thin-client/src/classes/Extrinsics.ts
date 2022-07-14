import { Section } from './Section';
import {
  SignTxResultResponse,
  UnsignedTxPayloadBody,
  SubmitTxBody,
  SubmitResultResponse,
  ExtrinsicResultResponse,
  FeeResponse,
  TxBuildBody,
} from '../types/Api';

export class Extrinsics extends Section {
  public readonly path = `${this.client.options.url}/extrinsic`;

  // todo path = 'extrinsics'
  // todo baseUrl = this.client.options.baseUrl + '/' + this.path;

  // private readonly url = `${this.url}/extrinsic`;

  // todo create метод эксринсика

  async getFee(
    args: TxBuildBody | UnsignedTxPayloadBody | SubmitTxBody,
  ): Promise<FeeResponse> {
    const response = await this.client.instance({
      method: 'POST',
      url: `${this.path}/calculate-fee`,
      data: args,
      // todo baseUrl = this.baseUrl
      // todo url: 'calculate-fee'
    });
    return response.data;
  }

  // eslint-disable-next-line class-methods-use-this
  async sign(
    args: UnsignedTxPayloadBody,
    signer: any, // todo signer = this.client.options.signer
  ): Promise<SignTxResultResponse> {
    if (!signer) throw new Error(`No signer provided`);

    return signer.sign(args);
    // const response = await this.client.instance({
    //   method: 'POST',
    //   url: `${this.path}/sign`,
    //   headers: { Authorization: `Seed //Bob` },
    //   data: args,
    // });
    // return response.data;
  }

  async submit(args: SubmitTxBody): Promise<SubmitResultResponse> {
    const response = await this.client.instance({
      method: 'POST',
      url: `${this.path}/submit`,
      data: args,
    });
    return response.data;
  }

  async status(hash: string): Promise<ExtrinsicResultResponse> {
    const response = await this.client.instance({
      method: 'GET',
      url: `${this.path}/status?hash=${hash}`,
      // todo params: { hash },
    });
    return response.data;
  }
}
