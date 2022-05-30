import { KeyringPair } from '@polkadot/keyring/types';

import { u8aToHex } from '@polkadot/util';
import { Sdk } from '@unique-nft/sdk';

import { ExtrinsicResult } from '@unique-nft/sdk/extrinsics/src/extrinsic-result-utils';
import { getDefaultSdkOptions, getKeyringPairs, delay } from './testing-utils';

describe('watch TXs', () => {
  let sdk: Sdk;
  let eve: KeyringPair;

  const mockCacheSet = jest.fn();

  beforeAll(async () => {
    ({ eve } = await getKeyringPairs());

    sdk = await Sdk.create(getDefaultSdkOptions());

    sdk.useCache({
      set: mockCacheSet,
      get: jest.fn(),
    });
  });

  it('works', async () => {
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(4, '0');

    const { signerPayloadJSON, signerPayloadHex } = await sdk.collection.create(
      {
        address: eve.address,
        name: 'Test collection',
        description: `Test collection created by unit test with random number ${random}`,
        tokenPrefix: 'TEST',
      },
    );

    const signature = u8aToHex(eve.sign(signerPayloadHex));

    const { extrinsicHash } = await sdk.extrinsics.submit({
      signerPayloadJSON,
      signature,
      signatureType: eve.type,
    });

    await delay(25_000);

    const lastCall = mockCacheSet.mock.calls.pop();
    const [hash, result] = lastCall;

    expect(hash).toEqual(extrinsicHash);

    expect(result).toMatchObject({
      extrinsicStatus: 'InBlock',
      isSubscribed: false,
      blockNumber: expect.any(Number),
      events: expect.any(Array),
    } as Partial<ExtrinsicResult>);
  }, 30_000);

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
