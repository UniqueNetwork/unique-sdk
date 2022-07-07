import { BalanceClient } from './index';

describe('set balance', () => {
  let balanceClient: any;
  let aliceAddress: string;
  let bobAddress: string;

  beforeAll(async () => {
    balanceClient = new BalanceClient('http://localhost:3000/', '//Alice');
    aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
    bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
  });

  it('transfer', async () => {
    const response: { data: object } = await balanceClient.transfer(
      aliceAddress,
      bobAddress,
      0.001,
      true,
    );
    expect(response.data).toMatchObject({
      hash: expect.any(String),
    });
  }, 60_000);
});
