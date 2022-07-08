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
    // todo вот эту всю штуку надо будет упаковать во что-то одно понятное
    // todo у тебя потому что будет много квери withFee&sign&signAndSubmit
    // todo хотяяя тут надо бы еще подумац
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
        }); // todo да но нет, мы подписывать должны на своей стороне.
      // todo надо в настройки клиента добавлять signer, который растет из accounts
      // todo а тут уже подписываем этим сайнером
      const submitResponse: { data: object } = await this.instance.post(
        `/extrinsic/submit`,
        {
          signature: signResponse.data.signature,
          signerPayloadJSON: buildResponse.data.signerPayloadJSON,
        },
        {
          headers: { Authorization: `Seed ${this.seed}` }, // здесь уже не надо сид передавать
        },
      );
      return submitResponse.data;
    } catch (e) {
      throw new Error('Balance transfer error');
    }
  }
}
