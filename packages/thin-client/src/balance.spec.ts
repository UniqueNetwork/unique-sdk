import * as process from 'process';
import { Client } from './index';

describe('balance', () => {
  let client: any;
  let aliceAddress: string;
  let bobAddress: string;

  beforeAll(async () => {
    client = new Client(
      process.env['API_URL'] || 'http://localhost:3000/',
      '//Alice',
    );
    aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
    bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
  });

  describe('get balance', () => {
    it('success', async () => {
      const response: object = await client.balance.get(aliceAddress);
      expect(response).toMatchObject({
        availableBalance: expect.any(Object),
        lockedBalance: expect.any(Object),
        freeBalance: expect.any(Object),
      });
    });

    it('error', async () => {
      expect(client.balance.get('111')).rejects.toThrow(Error);
    });
  });

  describe('transfer', () => {
    it('success', async () => {
      const response: object = await client.balance.transfer(
        aliceAddress,
        bobAddress,
        0.001,
        true,
      );
      expect(response).toMatchObject({
        hash: expect.any(String),
      });
    }, 60_000);

    it('error', async () => {
      expect(
        client.balance.transfer(aliceAddress, '111', 0.001, true),
      ).rejects.toThrow(Error);
    }, 60_000);
  });
});
