import { ThinClient } from './index';

const baseUrl = 'http://localhost:3000';

const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

describe('balance', () => {
  it('transfer', async () => {
    const client = new ThinClient({ url: baseUrl });
    const response: object = await client.balance.transfer.build({
      address: aliceAddress,
      destination: bobAddress,
      amount: 0.00001,
    });
    expect(response).toEqual(expect.any(Object));
  }, 60_000);
});
