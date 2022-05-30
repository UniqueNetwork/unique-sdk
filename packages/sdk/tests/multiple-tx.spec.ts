import { KeyringPair } from '@polkadot/keyring/types';

import { u8aToHex } from '@polkadot/util';
import { Sdk } from '@unique-nft/sdk';
import { ExtrinsicResult } from '@unique-nft/sdk/extrinsics/src/extrinsic-result-utils';
import { getDefaultSdkOptions, getKeyringPairs } from './testing-utils';

describe('multiple TXs', () => {
  let sdk: Sdk;
  let eve: KeyringPair;
  let ferdie: KeyringPair;

  beforeAll(async () => {
    ({ eve, ferdie } = await getKeyringPairs());

    sdk = await Sdk.create(getDefaultSdkOptions());
  });

  const makeTransfer = async (amount: number): Promise<ExtrinsicResult> => {
    const { signerPayloadJSON, signerPayloadHex } = await sdk.balance.transfer({
      address: eve.address,
      destination: ferdie.address,
      amount,
    });

    const signature = u8aToHex(eve.sign(signerPayloadHex));

    return sdk.extrinsics.submit({
      signerPayloadJSON,
      signature,
      signatureType: eve.type,
    });
  };

  it('3 transfers', async () => {
    const results: ExtrinsicResult[] = [];

    const makeMultipleTransfers = async () => {
      results.push(await makeTransfer(10));
      results.push(await makeTransfer(20));
      results.push(await makeTransfer(30));
    };

    await expect(makeMultipleTransfers()).resolves.not.toThrowError();

    expect(results.length).toBe(3);
  }, 10_000);

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
