import { Sdk } from '@unique-nft/sdk';
import {
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { CreateCollectionNewArguments, CreateTokenNewArguments } from '@unique-nft/sdk/tokens';
import { CreateTokenNewMutation } from '../create-token';
import { Approve } from './method';
import { ApproveArguments } from './types';
import { CreateCollectionExNewMutation } from '../create-collection-ex-new';
import { collectionSchemaToCreate } from '../../testing/collections-new.spec';

describe('approve-token', () => {
  let sdk: Sdk;

  let richAccount: TestAccount;

  let approve: Approve;
  let approveArgs: ApproveArguments;

  let collectionCreation: CreateCollectionExNewMutation;
  let createCollectionArgs: CreateCollectionNewArguments;

  let tokenCreation: CreateTokenNewMutation;
  let createTokenArgs: CreateTokenNewArguments;

  let collectionId: number;
  let tokenId: number;

  beforeAll(async () => {
    sdk = await createSdk(true);

    richAccount = createRichAccount();

    collectionCreation = new CreateCollectionExNewMutation(sdk);
    createCollectionArgs = {
      mode: 'Nft',
      name: 'Sample collection name',
      description: 'sample collection description',
      tokenPrefix: 'TEST',
      limits: {
        accountTokenOwnershipLimit: 1000,
        sponsoredDataSize: 1024,
        sponsoredDataRateLimit: 30,
        tokenLimit: 1000000,
        sponsorTransferTimeout: 6,
        sponsorApproveTimeout: 6,
        ownerCanTransfer: false,
        ownerCanDestroy: false,
        transfersEnabled: false,
      },
      metaUpdatePermission: 'ItemOwner',
      permissions: {
        access: 'Normal',
        mintMode: true,
        nesting: {
          tokenOwner: true,
          collectionAdmin: true,
        },
      },
      address: richAccount.address,
      schema: collectionSchemaToCreate,
    };

    const createCollectionResult = await collectionCreation.submitWaitResult(createCollectionArgs);
    collectionId = createCollectionResult.parsed.collectionId;

    tokenCreation = new CreateTokenNewMutation(sdk);
    createTokenArgs = {
      address: richAccount.address,
      collectionId,
      data: {
        encodedAttributes: {
          '0': 0,
          '1': [0],
          '2': 'foo_bar',
        },
        image: {
          ipfsCid: 'foo',
        },
      },
    };

    const createTokenResult = await tokenCreation.submitWaitResult(createTokenArgs);
    tokenId = createTokenResult.parsed.tokenId;

    approve = new Approve(sdk);
  }, 60_000);

  it('transformArgs', async () => {
    approveArgs = {
      collectionId,
      tokenId,
      spender: richAccount.address,
      amount: true,
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
      amount: true,
    };

    const approveResult = await approve.submitWaitResult(approveArgs);
    const { tokenId: resultTokenId, collectionId: resultCollectionId } = approveResult.parsed;

    expect(tokenId).toEqual(resultTokenId);
    expect(collectionId).toEqual(resultCollectionId);
  }, 60_000);
});
