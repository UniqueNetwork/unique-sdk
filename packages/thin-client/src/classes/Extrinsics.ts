import { Section } from './Section';
import { SignTxResultResponse } from '../types/Api';

export class Extrinsics extends Section {
  public readonly path = `${this.client.options.url}/extrinsic`;

  // private readonly url = `${this.url}/extrinsic`;

  async getFee(args: any) {
    const response = await this.client.instance({
      method: 'POST',
      url: `${this.path}/calculate-fee`,
      data: args,
    });
    return response.data;
  }

  // eslint-disable-next-line class-methods-use-this
  async sign(args: any, signer: any): Promise<SignTxResultResponse> {
    if (!signer) throw new Error(`No signer provided`);

    return signer.sign(args);
  }

  async submit(args: any) {
    const response = await this.client.instance({
      method: 'POST',
      url: `${this.path}/submit`,
      headers: {
        Authorization: 'Seed //Bob',
      },
      data: args,
    });
    return response.data;
  }

  async status(hash: string) {
    const response = await this.client.instance({
      method: 'GET',
      url: `${this.path}/status?hash=${hash}`,
    });
    return response.data;
  }
}
