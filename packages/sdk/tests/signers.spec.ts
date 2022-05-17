import { Keyring } from '@polkadot/keyring';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { SdkOptions } from '@unique-nft/sdk/types';
import { ErrorCodes, SdkError } from '@unique-nft/sdk/errors';
import { SdkSigner } from '@unique-nft/sdk/extrinsics';
import {
  createSigner,
  KeyfileSigner,
  SignerOptions,
} from '@unique-nft/sdk/sign';
import { Sdk } from '../src/lib/sdk';
import { getDefaultSdkOptions } from './testing-utils';

describe('signers', () => {
  let alice: KeyringPair;
  let bob: KeyringPair;

  const testUser = {
    seed: 'bus ahead nation nice damp recall place dance guide media clap language',
    password: '1234567890',
    keyfile: {
      encoded:
        'W+AsS/awIMmo6dB5lyornWFQ5bUpA1xUN8n8dxu9q2QAgAAAAQAAAAgAAADA6bTLjVK9tTinUDROjJNwL49vgFwn40WV1f7rb0svNFwK3AmNQ+pfW0i7mcFKt9id7KKNm2W3jr0vePTrQmOsfACWSyN55cYs2cqI/VbF/92ZUgo6YTbdwxLHzU1t3l1LdkU5DdaR5ZbPl7SGGYAk5FnjRLQmTWfXHEW1teuYbsdy8lthPoEYa/t57U30YZ21FzD/I7zt0IN9ekkD',
      encoding: {
        content: ['pkcs8', 'sr25519'],
        type: ['scrypt', 'xsalsa20-poly1305'],
        version: '3',
      },
      address: '5HNUuEAYMWEo4cuBW7tuL9mLHR9zSA8H7SdNKsNnYRB9M5TX',
      meta: {
        genesisHash: '',
        name: 'Unique-sdk test user',
        whenCreated: 1652779712656,
      },
    },
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
    errorMessage?: string,
  ) {
    try {
      await cb();
      expect(true).toEqual(false);
    } catch (err) {
      const sdkError = err as SdkError;
      console.log('sdkError', sdkError);
      expect(sdkError.code).toEqual(code);
      if (errorMessage) {
        expect(sdkError.message).toEqual(errorMessage);
      }
    }
  }

  it('uri validate - ok', async () => {
    await createSdk({
      uri: '//Alice',
    });
  });

  it('uri validate - fail', async () => {
    await tryAndExpectSdkError(async () => {
      await createSdk({
        uri: 'Alice',
      });
    }, ErrorCodes.Validation);
  });

  it('uri sign - ok', async () => {
    const sdk = await createSdk({
      uri: '//Alice',
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
    await sdk.extrinsics.verifySign({
      signature,
      signerPayloadJSON,
    });
  });

  it('uri sign - fail', async () => {
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

  it('seed sign - ok', async () => {
    const sdk = await createSdk({
      seed: testUser.seed,
    });
    const { signerPayloadHex } = await sdk.balance.buildTransfer({
      address: testUser.keyfile.address,
      destination: bob.address,
      amount: 0.001,
    });

    const { signature } = await sdk.extrinsics.sign({
      signerPayloadHex,
    });
    expect(typeof signature).toBe('string');
  });

  it('seed sign - fail', async () => {
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

  it('keyfile validate - fail', async () => {
    await tryAndExpectSdkError(async () => {
      const keyfile: object = {};
      await createSdk({
        keyfile: keyfile as KeyringPair$Json,
        passwordCallback() {
          return Promise.resolve('');
        },
      });
    }, ErrorCodes.Validation);
  });

  it('keyfile create - fail, pass empty', async () => {
    const sdk = await createSdk({
      keyfile: testUser.keyfile as KeyringPair$Json,
      passwordCallback() {
        return Promise.resolve('');
      },
    });
    await tryAndExpectSdkError(
      async () => {
        const signer = sdk.signer as KeyfileSigner;
        await signer.unlock();
      },
      ErrorCodes.InvalidSigner,
      'Password was not received',
    );
  });

  it('keyfile create - fail, pass invalid', async () => {
    const sdk = await createSdk({
      keyfile: testUser.keyfile as KeyringPair$Json,
      passwordCallback() {
        return Promise.resolve('123');
      },
    });
    await tryAndExpectSdkError(
      async () => {
        const signer = sdk.signer as KeyfileSigner;
        await signer.unlock();
      },
      ErrorCodes.InvalidSigner,
      'Unable to decode using the supplied passphrase',
    );
  });

  it('keyfile create - ok', async () => {
    await createSdk({
      keyfile: testUser.keyfile as KeyringPair$Json,
      passwordCallback() {
        return Promise.resolve(testUser.password);
      },
    });
  });

  it('keyfile sign - ok', async () => {
    const sdk = await createSdk({
      keyfile: testUser.keyfile as KeyringPair$Json,
      passwordCallback() {
        return Promise.resolve(testUser.password);
      },
    });

    const { signerPayloadHex, signerPayloadJSON } =
      await sdk.balance.buildTransfer({
        address: testUser.keyfile.address,
        destination: bob.address,
        amount: 0.001,
      });

    const { signature } = await sdk.extrinsics.sign({
      signerPayloadHex,
    });
    expect(typeof signature).toBe('string');
    await sdk.extrinsics.verifySign({
      signature,
      signerPayloadJSON,
    });
  });
});
