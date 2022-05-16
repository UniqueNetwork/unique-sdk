import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { SdkOptions } from '@unique-nft/sdk';
import { ErrorCodes, SdkError } from '@unique-nft/sdk/errors';
import { Sdk } from '../src/lib/sdk';
import { getDefaultSdkOptions } from './utils';

describe('signers', () => {
  let alice: KeyringPair;
  let bob: KeyringPair;

  beforeAll(async () => {
    await Sdk.create(getDefaultSdkOptions());
    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
    bob = new Keyring({ type: 'sr25519' }).addFromUri('//Bob');
  });

  async function tryAndExpectSdkError(
    cb: () => Promise<void>,
    code: ErrorCodes,
  ) {
    try {
      await cb();
      expect(true).toEqual(false);
    } catch (err) {
      const sdkError = err as SdkError;
      expect(sdkError.code).toEqual(code);
    }
  }

  it('seed signer validate - ok', async () => {
    const defOptions = getDefaultSdkOptions();
    const options: SdkOptions = {
      chainWsUrl: defOptions.chainWsUrl,
      ipfsGatewayUrl: defOptions.ipfsGatewayUrl,
      signer: {
        seed: '//Alice',
        developmentAccount: true,
      },
    };
    await Sdk.create(options);
  });

  it('seed signer validate - error', async () => {
    const defOptions = getDefaultSdkOptions();
    const options: SdkOptions = {
      chainWsUrl: defOptions.chainWsUrl,
      ipfsGatewayUrl: defOptions.ipfsGatewayUrl,
      signer: {
        seed: '//Alice',
      },
    };

    await tryAndExpectSdkError(async () => {
      await Sdk.create(options);
    }, ErrorCodes.Validation);
  });

  it('seed signer sign - ok', async () => {
    const defOptions = getDefaultSdkOptions();
    const options: SdkOptions = {
      chainWsUrl: defOptions.chainWsUrl,
      ipfsGatewayUrl: defOptions.ipfsGatewayUrl,
      signer: {
        seed: '//Alice',
        developmentAccount: true,
      },
    };
    const sdk = await Sdk.create(options);
    const { signerPayloadHex } = await sdk.balance.buildTransfer({
      address: alice.address,
      destination: bob.address,
      amount: 0.001,
    });

    const { signature } = await sdk.extrinsics.sign({
      signerPayloadHex,
    });
    expect(typeof signature).toBe('string');
  });

  it('seed signer sign - error', async () => {
    const defOptions = getDefaultSdkOptions();
    const options: SdkOptions = {
      chainWsUrl: defOptions.chainWsUrl,
      ipfsGatewayUrl: defOptions.ipfsGatewayUrl,
      signer: {
        seed: '//Alice',
        developmentAccount: true,
      },
    };
    const sdk = await Sdk.create(options);
    const { signerPayloadHex, signerPayloadJSON } =
      await sdk.balance.buildTransfer({
        address: bob.address,
        destination: alice.address,
        amount: 0.001,
      });

    const { signature } = await sdk.extrinsics.sign({
      signerPayloadHex,
    });
    await tryAndExpectSdkError(async () => {
      await sdk.extrinsics.verifySign({
        signature,
        signerPayloadJSON,
      });
    }, ErrorCodes.BadSignature);
  });
});
