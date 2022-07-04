import { KeyringPair } from '@polkadot/keyring/types';
import { Sdk } from '@unique-nft/sdk';
import { createSdk } from '@unique-nft/sdk/tests';
import { getNestingTokenAddress } from '@unique-nft/sdk/tokens';
import {
  NestTokenArguments,
  NestTokenResult,
  UnnestTokenArguments,
  UnnestTokenResult,
  TopmostTokenOwnerArguments,
  TopmostTokenOwnerResult,
  TokenParentArguments,
  TokenParentResult,
  TokenChildrenArguments,
  TokenChildrenResult,
} from '@unique-nft/sdk/tokens/types';
import { Keyring } from '@polkadot/api';

describe('Tokens', () => {
  let sdk: Sdk;
  let account: KeyringPair;
  let collectionId: number;

  beforeAll(async () => {
    sdk = await createSdk({
      seed: '//Alice',
    });

    const chainProperties = sdk.api.registry.getChainProperties();

    const ss58Format =
      chainProperties?.ss58Format.unwrapOrDefault().toNumber() || 0;

    const keyring = new Keyring({ type: 'sr25519' });

    keyring.setSS58Format(ss58Format);

    account = keyring.addFromUri('//Alice');

    const result = await sdk.collections.creation.submitWaitResult({
      address: account.address,
      description: 'Testing collection',
      name: 'Test',
      tokenPrefix: 'TEST',
      properties: {},
      permissions: {
        nesting: {
          tokenOwner: true,
          collectionAdmin: true,
        },
      },
    });

    collectionId = result.parsed.collectionId;

    await new Promise((resolve) => {
      const tokens = [{ NFT: {} }, { NFT: {} }, { NFT: {} }];
      const tx = sdk.api.tx.unique.createMultipleItems(
        collectionId,
        { Substrate: account.address },
        tokens,
      );
      tx.signAndSend(account, ({ status }) => {
        if (status.isInBlock) {
          resolve({});
        }
      });
    });
  }, 2 * 60_000);

  it('getNestingTokenAddress', () => {
    const address = getNestingTokenAddress(1, 1);

    expect(address).toBe('0xF8238ccFFF8ED887463Fd5e00000000100000001');
  });

  it('nestToken', async () => {
    const args: NestTokenArguments = {
      address: account.address,
      parent: {
        collectionId,
        tokenId: 1,
      },
      nested: {
        collectionId,
        tokenId: 2,
      },
    };

    const result = await sdk.tokens.nest.submitWaitResult(args);

    const expected: NestTokenResult = {
      collectionId,
      tokenId: 2,
    };

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);

  it('tokenChildren', async () => {
    const args: TokenChildrenArguments = {
      collectionId,
      tokenId: 1,
    };

    const result = await sdk.tokens.children(args);

    const expected: TokenChildrenResult = [
      {
        collectionId,
        tokenId: 2,
      },
    ];

    expect(result).toStrictEqual(expected);
  }, 60_000);

  it('tokenParent', async () => {
    const args: TokenParentArguments = {
      collectionId,
      tokenId: 2,
    };

    const result = await sdk.tokens.parent(args);

    const expected: TokenParentResult = {
      collectionId,
      tokenId: 1,
      address: getNestingTokenAddress(collectionId, 1).toLowerCase(),
    };

    expect(result).toStrictEqual(expected);
  }, 60_000);

  it('topmostTokenOwner', async () => {
    const args: TopmostTokenOwnerArguments = {
      collectionId,
      tokenId: 1,
    };

    const result = await sdk.tokens.topmostOwner(args);

    const expected: TopmostTokenOwnerResult = account.address;

    expect(result).toStrictEqual(expected);
  }, 60_000);

  it('unnestToken', async () => {
    const args: UnnestTokenArguments = {
      address: account.address,
      parent: {
        collectionId,
        tokenId: 1,
      },
      nested: {
        collectionId,
        tokenId: 2,
      },
    };
    const result = await sdk.tokens.unnest.submitWaitResult(args);

    const expected: UnnestTokenResult = {
      collectionId,
      tokenId: 2,
    };

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);
});
