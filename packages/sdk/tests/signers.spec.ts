import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { SdkOptions, SdkSigner } from '@unique-nft/sdk';
import { ErrorCodes, SdkError } from '@unique-nft/sdk/errors';
import { createSigner, SignerOptions } from '@unique-nft/sdk/sign';
import { Sdk } from '../src/lib/sdk';
import { getDefaultSdkOptions } from './utils';

describe('signers', () => {
  let alice: KeyringPair;
  let bob: KeyringPair;

  const testUser = {
    address: '5HHErUrB48ysnAcP8TJU9ZUx9fks4QwA8aDZtXqQBkttbW9S',
    seed: 'arrest lunch tone surprise recall output session drift among riot brand pulp',
  };

  const defOptions = getDefaultSdkOptions();

  beforeAll(async () => {
    await Sdk.create(defOptions);
    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
    bob = new Keyring({ type: 'sr25519' }).addFromUri('//Bob');
  });

  async function createSdk(signerOptions: SignerOptions): Promise<Sdk> {
    const signer: SdkSigner = await createSigner(signerOptions);
    const options: SdkOptions = {
      chainWsUrl: defOptions.chainWsUrl,
      ipfsGatewayUrl: defOptions.ipfsGatewayUrl,
      signer,
    };
    return Sdk.create(options);
  }

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

  it('uri signer validate - ok', async () => {
    await createSdk({
      uri: '//Alice',
    });
  });

  it('uri signer validate - fail', async () => {
    await tryAndExpectSdkError(async () => {
      await createSdk({
        uri: 'Alice',
      });
    }, ErrorCodes.Validation);
  });

  it('uri signer sign - ok', async () => {
    const sdk = await createSdk({
      uri: '//Alice',
    });
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

  it('uri signer sign - fail', async () => {
    const sdk = await createSdk({
      uri: '//Alice',
    });
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

  it('seed signer sign - ok', async () => {
    const sdk = await createSdk({
      seed: testUser.seed,
    });
    const { signerPayloadHex } = await sdk.balance.buildTransfer({
      address: testUser.address,
      destination: bob.address,
      amount: 0.001,
    });

    const { signature } = await sdk.extrinsics.sign({
      signerPayloadHex,
    });
    expect(typeof signature).toBe('string');
  });

  it('seed signer sign - fail', async () => {
    const sdk = await createSdk({
      seed: testUser.seed,
    });
    const { signerPayloadHex, signerPayloadJSON } =
      await sdk.balance.buildTransfer({
        address: alice.address,
        destination: bob.address,
        amount: 0.001,
      });

    const { signature } = await sdk.extrinsics.sign({
      signerPayloadHex,
    });
    expect(typeof signature).toBe('string');

    await tryAndExpectSdkError(async () => {
      await sdk.extrinsics.verifySign({
        signature,
        signerPayloadJSON,
      });
    }, ErrorCodes.BadSignature);
  });
});
