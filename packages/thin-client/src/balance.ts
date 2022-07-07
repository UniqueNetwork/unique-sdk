import { AxiosInstance } from 'axios';
import { SubmitExtrinsicError } from '@unique-nft/sdk/errors';

export class Balance {
  private instance: AxiosInstance;

  private seed: string;

  constructor(instance: AxiosInstance, seed: string) {
    this.instance = instance;
    this.seed = seed;
  }

  async get(address: string) {
    try {
      const balanceResponse: { data: object } = await this.instance.get(
        'balance',
        {
          params: {
            address,
          },
        },
      );
      return balanceResponse.data;
    } catch (e) {
      throw new Error('Balance transfer error');
    }
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
      const submitResponse: { data: object } = await this.instance.post(
        `/extrinsic/submit`,
        {
          signature: signResponse.data.signature,
          signerPayloadJSON: buildResponse.data.signerPayloadJSON,
        },
        {
          headers: { Authorization: `Seed ${this.seed}` },
        },
      );
      return submitResponse.data;
    } catch (e) {
      throw new Error('Balance transfer error');
    }
  }
}
