import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  createToken,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { CollectionIdArguments } from '../../types';
import { collectionTokensQuery } from './method';

describe('collection-tokens', () => {
  let sdk: Sdk;

  let richAccount: TestAccount;

  let collectionId: number;

  let tokensCount: number;

  let collectionTokensMethod: typeof collectionTokensQuery;

  let collectionTokensArgs: CollectionIdArguments;

  beforeAll(async () => {
    sdk = await createSdk(true);

    richAccount = createRichAccount();

    collectionTokensMethod = collectionTokensQuery.bind(sdk);

    collectionId = 1;

    tokensCount = 0;

    collectionTokensArgs = {
      collectionId,
    };
  });

  it('no tokens', async () => {
    const result = await collectionTokensMethod(collectionTokensArgs);

    expect(result).toHaveProperty('ids');
    expect(Array.isArray(result?.ids)).toBe(true);

    tokensCount = result?.ids?.length as number;
  });

  it('created new token', async () => {
    await createToken(sdk, collectionId, richAccount);

    const result = await collectionTokensMethod(collectionTokensArgs);

    expect(result?.ids).toHaveLength((tokensCount += 1));
  });

  // todo: Unskip when token burn is developed
  it.skip('token burned', async () => {
    // await burnToken(sdk, collectionId, richAccount);

    const result = await collectionTokensMethod(collectionTokensArgs);

    expect(result?.ids).toHaveLength((tokensCount -= 1));
  });
});
