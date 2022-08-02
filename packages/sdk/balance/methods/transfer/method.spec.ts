import { Sdk } from '@unique-nft/sdk';
import {
  createEthereumAccount,
  createPoorAccount,
  createRichAccount,
  createSdk,
  TestAccount,
  TestEthereumAccount,
} from '@unique-nft/sdk/testing';
import { VerificationFailedError } from '@unique-nft/sdk/errors';

import { BalanceTransferMutation } from './method';
import { BalanceTransferArguments } from './types';

describe('balance-transfer', () => {
  let sdk: Sdk;

  let richAccount: TestAccount;
  let poorAccount: TestAccount;
  let ethereumAccount: TestEthereumAccount;

  let transfer: BalanceTransferMutation;

  let createArgs: BalanceTransferArguments;

  beforeAll(async () => {
    sdk = await createSdk(true);

    richAccount = createRichAccount();

    poorAccount = createPoorAccount();

    ethereumAccount = createEthereumAccount();

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

  it('to-ethereum-ok', async () => {
    const result = await transfer.submitWaitResult({
      address: richAccount.address,
      destination: ethereumAccount.address,
      amount: 0.01,
    });

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
    }).rejects.toThrowError(new VerificationFailedError('Balance is too low'));
  }, 60_000);
});
