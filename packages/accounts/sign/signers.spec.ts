import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { cryptoWaitReady, signatureVerify } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import { SignerOptions } from './types';
import { createSignerSync } from './factory';

describe('Account signers', () => {
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

  beforeAll(async () => {
    await cryptoWaitReady();

    const keyring = new Keyring({ type: 'sr25519' });

    alice = keyring.addFromUri('//Alice');
    bob = keyring.addFromUri('//Bob');
  });

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

  it.each([
    ['alice', { seed: '//Alice' }],
    ['testUser', { seed: testUser.seed }],
    [
      'testUser',
      {
        keyfile: testUser.keyfile as KeyringPair$Json,
        passwordCallback() {
          return Promise.resolve(testUser.password);
        },
      },
    ],
  ])(
    '%# sign ok - %s',
    async (addressName: string, signerOptions: SignerOptions) => {
      const address = getAddressByName(addressName);
      const signer = createSignerSync(signerOptions);

      const unsignedTxPayload: any = {
        signerPayloadHex: '0x1234567890',
        signerPayloadJSON: {},
        signerPayloadRaw: {},
      };
      const { signature } = await signer.sign(unsignedTxPayload);

      expect(typeof signature).toBe('string');
      const { isValid } = signatureVerify(
        unsignedTxPayload.signerPayloadHex,
        signature,
        address,
      );
      expect(isValid).toBe(true);
    },
  );
});
