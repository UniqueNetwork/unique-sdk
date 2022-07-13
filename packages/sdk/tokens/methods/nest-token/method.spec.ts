import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/tests';
import { getNestingTokenAddress } from '@unique-nft/sdk/tokens';
import { NestTokenMutation } from './method';
import { NestTokenArguments } from './types';

describe('nestToken', () => {
  let sdk: Sdk;

  let account: TestAccount;

  let nestToken: NestTokenMutation;

  let args: NestTokenArguments;

  beforeAll(async () => {
    sdk = await createSdk(true);

    account = createRichAccount();

    nestToken = new NestTokenMutation(sdk);
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

    const transformed = await nestToken.transformArgs(args);

    const from = {
      Substrate: args.address,
    };

    const to = {
      Ethereum: getNestingTokenAddress(
        args.parent.collectionId,
        args.parent.tokenId,
      ),
    };

    expect(transformed).toMatchObject({
      address: args.address,
      section: 'unique',
      method: 'transferFrom',
      args: [from, to, args.nested.collectionId, args.nested.tokenId, 1],
    });
  });
});
