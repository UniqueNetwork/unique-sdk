import Axios, { AxiosInstance } from 'axios';

export class BalanceClient {
  private baseUrl: string;

  private instance: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = `${baseUrl}balance`;
    this.instance = Axios.create({
      baseURL: this.baseUrl,
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
    await this.instance
      .post(
        '/transfer',
        {
          address,
          destination,
          amount,
        },
        config,
      )
      .then((response) => response.data)
      .catch((err) => {
        throw err;
      });
  }
}
