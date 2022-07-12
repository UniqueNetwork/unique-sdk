import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import request from 'supertest';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';

import { BalanceController } from '../src/app/modules/substrate/controllers/balance/controller';
import { createApp } from './utils.test';
import { Config } from '../src/app/config/config.module';

describe(BalanceController.name, () => {
  let app: INestApplication;
  let alice: KeyringPair;
  let secondaryChainWsUrl: string;
  let name: string;

  beforeAll(async () => {
    app = await createApp();
    const config = app.get(ConfigService);
    const obj = config.get<Config['secondary']>('secondary');
    secondaryChainWsUrl = obj.chainWsUrl;
    name = obj.name;
    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
  });

  describe('check secondary chainWsUrl', () => {
    it('success request to secondary chainWsUrl', async () => {
      const { ok } = await request(app.getHttpServer())
        .get(`/api/${name}/balance`)
        .query({ address: alice.address });
      expect(ok).toEqual(true);
    });

    it('comparison GET balance on chainWsUrl and secondary', async () => {
      if (!(secondaryChainWsUrl && name)) return;
      const {
        body: {
          availableBalance: { unit },
        },
      } = await request(app.getHttpServer())
        .get(`/api/balance`)
        .query({ address: alice.address });
      const {
        body: {
          availableBalance: { unit: secondaryUnit },
        },
      } = await request(app.getHttpServer())
        .get(`/api/${name}/balance`)
        .query({ address: alice.address });

      expect(unit).not.toBe(secondaryUnit);
    });
  });
});
