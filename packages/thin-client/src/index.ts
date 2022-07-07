import Axios, { AxiosInstance } from 'axios';

export class BalanceClient {
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

  async transfer(
    address: string,
    destination: string,
    amount: number,
    withFee?: boolean,
  ) {
    const config: { params?: object } = {};
    if (withFee !== undefined) {
      config.params = {
        withFee,
      };
    }
    try {
      const buildResponse: {
        ok: boolean;
        data: { signerPayloadJSON: object };
      } = await this.instance.post(
        'balance/transfer',
        {
          address,
          destination,
          amount,
        },
        config,
      );
      const signResponse: { data: { signature: string } } =
        await this.instance.post(`/extrinsic/sign`, buildResponse.data, {
          headers: { Authorization: `Seed ${this.seed}` },
        });
      return await this.instance.post(
        `/extrinsic/submit`,
        {
          signature: signResponse.data.signature,
          signerPayloadJSON: buildResponse.data.signerPayloadJSON,
        },
        {
          headers: { Authorization: `Seed ${this.seed}` },
        },
      );
    } catch (e) {
      return { success: false };
    }
  }
}
