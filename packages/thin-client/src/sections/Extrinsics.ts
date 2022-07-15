import { Section } from '../classes/Section';
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
  public readonly path = 'extrinsic';

  public readonly baseUrl = `${this.client.options.baseUrl}/${this.path}`;

  // todo create метод эксринсика

  async getFee(
    args: TxBuildBody | UnsignedTxPayloadBody | SubmitTxBody,
  ): Promise<FeeResponse> {
    const response = await this.client.instance({
      method: 'POST',
      baseURL: this.baseUrl,
      url: 'calculate-fee',
      data: args,
    });
    return response.data;
  }

  // eslint-disable-next-line class-methods-use-this
  async sign(
    args: UnsignedTxPayloadBody,
    signer: any = this.client.options.signer,
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
      baseURL: this.baseUrl,
      url: 'submit',
      data: args,
    });
    return response.data;
  }

  async status(hash: string): Promise<ExtrinsicResultResponse> {
    const response = await this.client.instance({
      method: 'GET',
      baseURL: this.baseUrl,
      url: 'status',
      params: { hash },
    });
    return response.data;
  }
}
