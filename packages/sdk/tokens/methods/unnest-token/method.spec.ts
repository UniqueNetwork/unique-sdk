import { Sdk } from '@unique-nft/sdk';
import { createSdk } from '@unique-nft/sdk/tests';
import { getNestingTokenAddress } from '@unique-nft/sdk/tokens';
import { UnnestTokenMutation } from './method';
import { UnnestTokenArguments } from './types';

describe('unnestToken', () => {
  let sdk: Sdk;

  let unnestToken: UnnestTokenMutation;

  let args: UnnestTokenArguments;

  beforeAll(async () => {
    sdk = await createSdk({
      seed: '//Alice',
    });

    unnestToken = new UnnestTokenMutation(sdk);
  });

  it('transformArgs', async () => {
    args = {
      address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
      parent: {
        collectionId: 1,
        tokenId: 1,
      },
      nested: {
        collectionId: 1,
        tokenId: 2,
      },
    };

    const transformed = await unnestToken.transformArgs(args);

    const from = {
      Ethereum: getNestingTokenAddress(
        args.parent.collectionId,
        args.parent.tokenId,
      ),
    };

    const to = {
      Substrate: args.address,
    };

    expect(transformed).toMatchObject({
      address: args.address,
      section: 'unique',
      method: 'transferFrom',
      args: [from, to, args.nested.collectionId, args.nested.tokenId, 1],
    });
  });
});
