import { Sdk } from '@unique-nft/sdk';
import {
  createPoorAccount,
  createRichAccount,
  createSdk,
} from '@unique-nft/sdk/tests';

import { BalanceTransferMutation } from './method';
import { BalanceTransferArguments } from './types';

describe('balance-transfer', () => {
  let sdk: Sdk;

  let transfer: BalanceTransferMutation;

  let createArgs: BalanceTransferArguments;

  beforeAll(async () => {
    sdk = await createSdk(true);

    const richAccount = createRichAccount();

    const poorAccount = createPoorAccount();

    transfer = new BalanceTransferMutation(sdk);

    createArgs = {
      address: richAccount.address,
      destination: poorAccount.address,
      amount: 0.00023,
    };
  });

  it('transfer', async () => {
    const result = await transfer.submitWaitResult(createArgs);

    expect(result.parsed.success).toBe(true);
  }, 60_000);
});
