import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createPoorAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
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
  TransferFromArguments,
  TransferResult,
} from '@unique-nft/sdk/tokens/types';
import { Keyring } from '@polkadot/api';
import {
  normalizeAddress,
  addressToCrossAccountId,
} from '@unique-nft/sdk/utils';
import { Address } from '@unique-nft/sdk/types';

describe('Tokens', () => {
  let sdk: Sdk;
  let richAccount: TestAccount;
  let poorAccount: TestAccount;
  let collectionId: number;
  let keyring: Keyring;
  let ss58Format: number;

  beforeAll(async () => {
    sdk = await createSdk(true);
    richAccount = createRichAccount();
    poorAccount = createPoorAccount();

    const chainProperties = sdk.api.registry.getChainProperties();

    ss58Format = chainProperties?.ss58Format.unwrapOrDefault().toNumber() || 0;

    keyring = new Keyring({ type: 'sr25519' });

    keyring.setSS58Format(ss58Format);

    const result = await sdk.collections.creation.submitWaitResult({
      address: richAccount.address,
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
        { Substrate: richAccount.address },
        tokens,
      );
      tx.signAndSend(richAccount.keyringPair, ({ status }) => {
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
      address: richAccount.address,
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

    const expected: TopmostTokenOwnerResult = richAccount.address;

    expect(normalizeAddress(result as Address)).toStrictEqual(
      normalizeAddress(expected as Address),
    );
  }, 60_000);

  it('unnestToken', async () => {
    const args: UnnestTokenArguments = {
      address: richAccount.address,
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

  it('transferFrom', async () => {
    const args: TransferFromArguments = {
      address: richAccount.address,
      from: richAccount.address,
      to: poorAccount.address,
      collectionId,
      tokenId: 1,
    };

    const result = await sdk.tokens.transferFrom.submitWaitResult(args);

    const richAccoutAddress = keyring.encodeAddress(
      richAccount.keyringPair.publicKey,
      ss58Format,
    );

    const poorAccountAddress = keyring.encodeAddress(
      poorAccount.keyringPair.publicKey,
      ss58Format,
    );

    const expected: TransferResult = {
      from: addressToCrossAccountId(richAccoutAddress),
      to: addressToCrossAccountId(poorAccountAddress),
      collectionId,
      tokenId: 1,
    };

    expect(result.parsed).toStrictEqual(expected);
  }, 60_000);
});
