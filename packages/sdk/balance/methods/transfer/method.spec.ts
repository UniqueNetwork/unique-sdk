import { Sdk } from '@unique-nft/sdk';
import {
  createSdk,
  getKeyringPairs,
  TestAccounts,
} from '@unique-nft/sdk/tests';

import { BalanceTransferMutation } from './method';
import { BalanceTransferArguments } from './types';

describe('balance-transfer', () => {
  let sdk: Sdk;
  let testAccounts: TestAccounts;

  let transfer: BalanceTransferMutation;

  let createArgs: BalanceTransferArguments;

  beforeAll(async () => {
    sdk = await createSdk({
      seed: '//Bob',
    });

    testAccounts = await getKeyringPairs();

    transfer = new BalanceTransferMutation(sdk);

    // 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
    // 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
    createArgs = {
      address: testAccounts.bob.address,
      destination: testAccounts.alice.address,
      amount: 0.00023,
    };
  });

  it('transfer', async () => {
    const result = await transfer.submitWaitResult(createArgs);

    expect(result.parsed.success).toBe(true);
  }, 60_000);
});
