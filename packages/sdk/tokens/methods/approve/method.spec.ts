import { Sdk } from '@unique-nft/sdk';
import {
  createCollection,
  createRichAccount,
  createSdk,
  createToken,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { Approve } from './method';
import { ApproveArguments } from './types';

describe('approve-token', () => {
  let sdk: Sdk;

  let richAccount: TestAccount;

  let approve: Approve;
  let approveArgs: ApproveArguments;

  let collectionId: number;
  let tokenId: number;

  beforeAll(async () => {
    sdk = await createSdk(true);

    richAccount = createRichAccount();

    const collection = await createCollection(sdk, richAccount);
    const token = await createToken(sdk, collection.id, richAccount);
    collectionId = collection.id;
    tokenId = token.id;

    approve = new Approve(sdk);
  }, 60_000);

  it('transformArgs', async () => {
    approveArgs = {
      collectionId,
      tokenId,
      spender: richAccount.address,
      isApprove: true,
    };
    const transformed = await approve.transformArgs(approveArgs);

    expect(transformed).toMatchObject({
      address: approveArgs.spender,
      section: 'unique',
      method: 'approve',
      args: [{ substrate: approveArgs.spender }, approveArgs.collectionId, approveArgs.tokenId, 1],
    });
  });

  it('approve token', async () => {
    approveArgs = {
      spender: richAccount.address,
      collectionId,
      tokenId,
      isApprove: true,
    };

    const approveResult = await approve.submitWaitResult(approveArgs);
    const { tokenId: resultTokenId, collectionId: resultCollectionId } = approveResult.parsed;

    expect(tokenId).toEqual(resultTokenId);
    expect(collectionId).toEqual(resultCollectionId);
  }, 60_000);
});
