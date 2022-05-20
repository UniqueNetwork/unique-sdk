import { Keyring } from '@polkadot/keyring';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { SdkOptions, SdkSigner } from '@unique-nft/sdk/types';
import {
  BadSignatureError,
  InvalidSignerError,
  ValidationError,
} from '@unique-nft/sdk/errors';
import { cryptoWaitReady } from '@polkadot/util-crypto';
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
    await cryptoWaitReady();
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

  function getAddressByName(name: string): string {
    switch (name) {
      case 'alice':
        return alice.address;
      case 'bob':
        return bob.address;
      case 'testUser':
        return testUser.keyfile.address;
      default:
        return '';
    }
  }

  describe('seed/uri', () => {
    it('uri validate - ok', async () => {
      await createSdk({
        uri: '//Alice',
      });
    });

    it('uri validate - fail', async () => {
      await expect(async () => {
        await createSdk({
          uri: 'Alice',
        });
      }).rejects.toThrowError(new ValidationError({}));
    });

    it.each([
      ['alice', { uri: '//Alice' }],
      ['testUser', { seed: testUser.seed }],
    ])(
      'sign ok - %s',
      async (addressName: string, signerOptions: SignerOptions) => {
        const sdk = await createSdk(signerOptions);
        const { signerPayloadHex, signerPayloadJSON } =
          await sdk.balance.transfer({
            address: getAddressByName(addressName),
            destination: bob.address,
            amount: 0.001,
          });

        const { signature, signatureType } = await sdk.extrinsics.sign({
          signerPayloadHex,
        });

        expect(typeof signature).toBe('string');
        await sdk.extrinsics.verifySignOrThrow({
          signature,
          signatureType,
          signerPayloadJSON,
        });
      },
    );

    it.each([
      ['bob', 'alice', { uri: '//Alice' }],
      ['alice', 'bob', { seed: testUser.seed }],
    ])(
      'sign fail - %s->%s',
      async (
        addressName: string,
        destinationName: string,
        signerOptions: SignerOptions,
      ) => {
        const sdk = await createSdk(signerOptions);
        const { signerPayloadHex, signerPayloadJSON } =
          await sdk.balance.transfer({
            address: getAddressByName(addressName),
            destination: getAddressByName(destinationName),
            amount: 0.001,
          });

        const { signature, signatureType } = await sdk.extrinsics.sign({
          signerPayloadHex,
        });

        await expect(async () => {
          await sdk.extrinsics.verifySignOrThrow({
            signature,
            signatureType,
            signerPayloadJSON,
          });
        }).rejects.toThrowError(new BadSignatureError());
      },
    );
  });

  describe('keyfile', () => {
    it('validate - fail', async () => {
      await expect(async () => {
        const keyfile: object = {};
        await createSdk({
          keyfile: keyfile as KeyringPair$Json,
          passwordCallback() {
            return Promise.resolve('');
          },
        });
      }).rejects.toThrowError(new ValidationError({}));
    });

    it('create - fail, pass empty', async () => {
      const sdk = await createSdk({
        keyfile: testUser.keyfile as KeyringPair$Json,
        passwordCallback() {
          return Promise.resolve('');
        },
      });
      await expect(async () => {
        const signer = sdk.signer as KeyfileSigner;
        await signer.unlock();
      }).rejects.toThrowError(
        new InvalidSignerError('Password was not received'),
      );
    });

    it('create - fail, pass invalid', async () => {
      const sdk = await createSdk({
        keyfile: testUser.keyfile as KeyringPair$Json,
        passwordCallback() {
          return Promise.resolve('123');
        },
      });
      await expect(async () => {
        const signer = sdk.signer as KeyfileSigner;
        await signer.unlock();
      }).rejects.toThrowError(
        new InvalidSignerError(
          'Unable to decode using the supplied passphrase',
        ),
      );
    });

    it('create - ok', async () => {
      await createSdk({
        keyfile: testUser.keyfile as KeyringPair$Json,
        passwordCallback() {
          return Promise.resolve(testUser.password);
        },
      });
    });

    it('sign - ok', async () => {
      const sdk = await createSdk({
        keyfile: testUser.keyfile as KeyringPair$Json,
        passwordCallback() {
          return Promise.resolve(testUser.password);
        },
      });

      const { signerPayloadHex, signerPayloadJSON } =
        await sdk.balance.transfer({
          address: testUser.keyfile.address,
          destination: bob.address,
          amount: 0.001,
        });

      const { signature, signatureType } = await sdk.extrinsics.sign({
        signerPayloadHex,
      });

      expect(typeof signature).toBe('string');

      await sdk.extrinsics.verifySignOrThrow({
        signature,
        signatureType,
        signerPayloadJSON,
      });
    });
  });
});
