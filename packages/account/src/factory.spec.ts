import { cryptoWaitReady } from '@polkadot/util-crypto';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { createSignerSync } from './factory';
import { SeedSigner } from './seed-signer';
import { KeyfileSigner } from './keyfile-signer';
import { PolkadotSigner } from '../polkadot-signer';

jest.mock('./polkadot-signer/polkadot-signer');

describe('Factory', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
  });
  it('create alice', () => {
    const signer = createSignerSync({
      seed: '//Alice',
    });

    expect(signer).toBeInstanceOf(SeedSigner);
  });

  it('create mnemonic', () => {
    const signer = createSignerSync({
      seed: 'word1 word2 word3',
    });

    expect(signer).toBeInstanceOf(SeedSigner);
  });

  it('create keyfile', () => {
    const signer = createSignerSync({
      passwordCallback: (): Promise<string> => Promise.resolve('123'),
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
    });

    expect(signer).toBeInstanceOf(KeyfileSigner);
  });

  it('create polkadot-signer', async () => {
    const signer = new PolkadotSigner({
      chooseAccount: (
        accounts: InjectedAccountWithMeta[],
      ): Promise<InjectedAccountWithMeta> => Promise.resolve(accounts[0]),
    });
  });
});
