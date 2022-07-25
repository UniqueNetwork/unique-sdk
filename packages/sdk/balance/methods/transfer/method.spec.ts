import { Sdk } from '@unique-nft/sdk';
import {
  createPoorAccount,
  createRichAccount,
  createSdk,
} from '@unique-nft/sdk/testing';

import { BalanceTransferMutation } from './method';
import { BalanceTransferArguments } from './types';

describe('balance-transfer', () => {
  it('ok', async () => {
    const sdk: Sdk = await createSdk(true);
    const richAccount = createRichAccount();
    const poorAccount = createPoorAccount();
    const { isCompleted, parsed } = await sdk.balance.transfer.submitWaitResult(
      {
        address: richAccount.address,
        destination: poorAccount.address,
        amount: 0.01,
      },
    );

    expect(isCompleted).toBe(true);
    expect(parsed.success).toBe(true);
  }, 30_000);
});

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
