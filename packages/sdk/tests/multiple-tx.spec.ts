import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';

import {
  createPoorAccount,
  createRichAccount,
  createSdk,
  signWithAccount,
  TestAccount,
} from './testing-utils';
import { Sdk } from '../src/lib/sdk';

describe('multiple TXs', () => {
  let sdk: Sdk;
  let richAccount: TestAccount;
  let poorAccount: TestAccount;

  beforeAll(async () => {
    sdk = await createSdk(false);
    richAccount = createRichAccount();
    poorAccount = createPoorAccount();
  });

  const makeTransfer = async (amount: number): Promise<void> => {
    const { signerPayloadJSON, signerPayloadHex } =
      await sdk.balance.transfer.build({
        address: richAccount.address,
        destination: poorAccount.address,
        amount,
      });

    const signature = signWithAccount(sdk, richAccount, signerPayloadHex);

    await sdk.extrinsics.submit({
      signerPayloadJSON,
      signature,
    });
  };

  it('3 transfers', async () => {
    const makeMultipleTransfers = async () => {
      await makeTransfer(100);
      await makeTransfer(100 + 1);
      await makeTransfer(100 + 2);
    };

    await expect(makeMultipleTransfers()).resolves.not.toThrowError();
  }, 10_000);

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
