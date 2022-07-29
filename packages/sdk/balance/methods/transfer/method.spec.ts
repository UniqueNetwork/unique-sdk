import { Sdk } from '@unique-nft/sdk';
import {
  createPoorAccount,
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { VerificationError } from '@unique-nft/sdk/errors';

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

  let richAccount: TestAccount;
  let poorAccount: TestAccount;

  let transfer: BalanceTransferMutation;

  let createArgs: BalanceTransferArguments;

  beforeAll(async () => {
    sdk = await createSdk(true);

    richAccount = createRichAccount();

    poorAccount = createPoorAccount();

    transfer = new BalanceTransferMutation(sdk);

    createArgs = {
      address: richAccount.address,
      destination: poorAccount.address,
      amount: 0.00023,
    };
  });

  it('ok', async () => {
    const result = await transfer.submitWaitResult(createArgs);

    expect(result.parsed.success).toBe(true);
  }, 60_000);

  it('verification-fail', async () => {
    const balance = await sdk.balance.get({ address: richAccount.address });

    await expect(async () => {
      await transfer.submitWaitResult({
        address: richAccount.address,
        destination: poorAccount.address,
        amount: +balance.freeBalance.amount + 1,
      });
    }).rejects.toThrowError(new VerificationError('Balance is too low'));
  }, 60_000);
});
