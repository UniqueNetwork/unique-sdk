import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';

import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { SubmitTxArguments } from '@unique-nft/sdk/types';
import {
  createPoorAccount,
  createRichAccount,
  createSdk,
  signWithAccount,
  TestAccount,
} from '@unique-nft/sdk/tests';
import { Sdk } from '../src/lib/sdk';

describe('watch TX', () => {
  let sdk: Sdk;
  let richAccount: TestAccount;
  let poorAccount: TestAccount;

  beforeAll(async () => {
    sdk = await createSdk(false);

    richAccount = createRichAccount();
    poorAccount = createPoorAccount();
  });

  const getSignedTransfer = async (
    amount: string | number,
  ): Promise<SubmitTxArguments> => {
    const { signerPayloadJSON, signerPayloadHex } = await sdk.extrinsics.build({
      address: richAccount.address,
      section: 'balances',
      method: 'transfer',
      args: [poorAccount.address, amount],
    });

    const signature = signWithAccount(sdk, richAccount, signerPayloadHex);

    return { signerPayloadJSON, signature };
  };

  it('watch extrinsic succeed', async () => {
    const signedTransfer = await getSignedTransfer(10);

    const succeed = await sdk.extrinsics.submitWaitCompleted(signedTransfer);

    expect(succeed.status.type).toBe('InBlock');
    expect(succeed.dispatchError).toBeFalsy();
  }, 60_000);

  it('watch extrinsic failed', async () => {
    const balance = await sdk.balance.get({ address: richAccount.address });

    const signedTransfer = await getSignedTransfer(
      balance.availableBalance.raw,
    );

    const failed = await sdk.extrinsics
      .submitWaitCompleted(signedTransfer)
      .catch((e: ISubmittableResult) => e);

    expect(failed.status.type).toBe('InBlock');
    expect(failed.dispatchError).toBeTruthy();
  }, 60_000);

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
