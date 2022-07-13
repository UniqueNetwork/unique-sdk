import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/tests';
import { getNestingTokenAddress } from '@unique-nft/sdk/tokens';
import { UnnestTokenMutation } from './method';
import { UnnestTokenArguments } from './types';

describe('unnestToken', () => {
  let sdk: Sdk;

  let account: TestAccount;

  let unnestToken: UnnestTokenMutation;

  let args: UnnestTokenArguments;

  beforeAll(async () => {
    sdk = await createSdk(true);

    account = createRichAccount();

    unnestToken = new UnnestTokenMutation(sdk);
  });

  it('transformArgs', async () => {
    args = {
      address: account.address,
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
