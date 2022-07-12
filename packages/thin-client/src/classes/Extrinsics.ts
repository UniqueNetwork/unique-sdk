import { Section } from './Section';

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

  async sign(args: any) {
    const response = await this.client.instance({
      method: 'POST',
      url: `${this.path}/sign`,
      headers: {
        Authorization: 'Seed //Bob',
      },
      data: args,
    });
    return response.data;
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
}
