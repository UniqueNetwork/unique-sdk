import { KeyringPair } from '@polkadot/keyring/types';

import { u8aToHex } from '@polkadot/util';
import { getDefaultSdkOptions, getKeyringPairs } from './testing-utils';
import { Sdk } from '../src/lib/sdk';

describe('multiple TXs', () => {
  let sdk: Sdk;
  let eve: KeyringPair;
  let ferdie: KeyringPair;

  beforeAll(async () => {
    ({ eve, ferdie } = await getKeyringPairs());

    sdk = await Sdk.create(getDefaultSdkOptions());
  });

  const makeTransfer = async (amount: number): Promise<void> => {
    const { signerPayloadJSON, signerPayloadHex } = await sdk.balance.transfer({
      address: eve.address,
      destination: ferdie.address,
      amount,
    });

    const signature = u8aToHex(eve.sign(signerPayloadHex));

    await sdk.extrinsics.submit({
      signerPayloadJSON,
      signature,
      signatureType: eve.type,
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
