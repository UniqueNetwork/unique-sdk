import { u8aToHex } from '@polkadot/util';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { Sdk } from '../src/lib/sdk';

describe(Sdk.name, () => {
  let sdk: Sdk;
  let alice: KeyringPair;
  let bob: KeyringPair;

  beforeAll(async () => {
    sdk = new Sdk({ chainWsUrl: 'wss://ws-quartz-dev.comecord.com' });

    await sdk.isReady;

    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
    bob = new Keyring({ type: 'sr25519' }).addFromUri('//Bob');
  });

  it('balances transfer build & submit test', async () => {
    expect(Sdk).toBeDefined();

    const txPayload = await sdk.buildTx({
      address: alice.address,
      section: 'balances',
      method: 'transfer',
      args: [bob.address, 1000_000],
    });

    expect(txPayload).toMatchObject({
      signerPayloadHex: expect.any(String),
      signerPayloadJSON: expect.any(Object),
      signerPayloadRaw: expect.any(Object),
    });

    const { signerPayloadJSON, signerPayloadHex } = txPayload;

    const signatureU8a = alice.sign(signerPayloadHex, {
      withType: true,
    });

    const signature = u8aToHex(signatureU8a);

    const submitPromise = sdk.submitTx({
      signature,
      signerPayloadJSON,
    });

    await expect(submitPromise).resolves.toMatchObject({
      hash: expect.any(String),
    });
  });
});
