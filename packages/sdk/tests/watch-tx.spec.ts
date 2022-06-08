import { KeyringPair } from '@polkadot/keyring/types';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';

import { lastValueFrom } from 'rxjs';
import { SubmitTxArguments } from '@unique-nft/sdk/types';
import {
  getDefaultSdkOptions,
  getKeyringPairs,
  signWithAccount,
} from './testing-utils';
import { Sdk } from '../src/lib/sdk';

describe('watch TX', () => {
  let sdk: Sdk;
  let eve: KeyringPair;
  let ferdie: KeyringPair;

  beforeAll(async () => {
    ({ eve, ferdie } = await getKeyringPairs());

    sdk = await Sdk.create(getDefaultSdkOptions());
  });

  const getSignedTransfer = async (
    amount: string | number,
  ): Promise<SubmitTxArguments> => {
    const { signerPayloadJSON, signerPayloadHex } = await sdk.extrinsics.build({
      address: eve.address,
      section: 'balances',
      method: 'transfer',
      args: [ferdie.address, amount],
    });

    const signature = signWithAccount(sdk, eve, signerPayloadHex);

    return { signerPayloadJSON, signature };
  };

  it('watch extrinsic succeed', async () => {
    const signedTransfer = await getSignedTransfer(10);

    const { result$ } = await sdk.extrinsics.submitAndObserve(signedTransfer);

    const succeed = await lastValueFrom(result$);

    expect(succeed.status.type).toBe('InBlock');
    expect(succeed.dispatchError).toBeFalsy();
  }, 60_000);

  it('watch extrinsic failed', async () => {
    const balance = await sdk.balance.get({ address: eve.address });

    const signedTransfer = await getSignedTransfer(balance.raw);

    const failed = await sdk.extrinsics.submitWaitCompleted(signedTransfer);

    expect(failed.status.type).toBe('InBlock');
    expect(failed.dispatchError).toBeTruthy();
  }, 60_000);

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
