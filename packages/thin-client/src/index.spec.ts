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

  it('get balance', async () => {
    const response: { data: object } = await balanceClient.get(aliceAddress);
    expect(response.data).toMatchObject({
      availableBalance: expect.any(Object),
      lockedBalance: expect.any(Object),
      freeBalance: expect.any(Object),
    });
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
