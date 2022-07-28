/**
 * @jest-environment node
 */
import * as process from 'process';
import { INestApplication } from '@nestjs/common';

import { SdkSigner, SignatureType } from '@unique-nft/accounts';
import { KeyringProvider } from '@unique-nft/accounts/keyring';

import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/state-queries';
import '@unique-nft/sdk/extrinsics';

import { Client } from '../index';
import {
  CollectionInfoWithSchemaResponse,
  CreateCollectionParsed,
  ExtrinsicResultResponse,
  TokenId,
  UniqueTokenDecodedResponse,
} from '../types/api';
import { createWeb } from './utils.test';
import {
  inputDataForCreateCollection,
  inputDataForCreateToken,
} from './values';

const baseUrl = process.env.TEST_WEB_APP_URL || 'http://localhost:3001';
const TEST_RICH_ACCOUNT = process.env['TEST_RICH_ACCOUNT'] || '//Bob'; // eslint-disable-line

describe('client tests', () => {
  let app: INestApplication;
  let richAccountAddress: string;
  let signer: SdkSigner;

  beforeAll(async () => {
    if (!app) {
      app = await createWeb();
    }

    const keyringProvider = new KeyringProvider({
      type: SignatureType.Sr25519,
    });
    const richAccount = keyringProvider.addSeed(TEST_RICH_ACCOUNT);
    richAccountAddress = richAccount.instance.address;
    signer = richAccount.getSigner();
  }, 100_000);

  afterAll(() => {
    app.close();
  });

  describe('collections and tokens', () => {
    it('create and get', async () => {
      const client = new Client({ baseUrl, signer });
      const createCollectionResponse: ExtrinsicResultResponse<CreateCollectionParsed> =
        await client.collections.createCollectionEx.submitWaitResult(
          inputDataForCreateCollection,
        );
      expect(createCollectionResponse.parsed.collectionId).toEqual(
        expect.any(Number),
      );
      const { collectionId } = createCollectionResponse.parsed;

      const getCollectionResponse: CollectionInfoWithSchemaResponse =
        await client.collections.collectionById({
          collectionId,
        });
      expect(getCollectionResponse.id).toEqual(expect.any(Number));

      const createTokenResponse: ExtrinsicResultResponse<TokenId> =
        await client.tokens.createToken.submitWaitResult({
          ...inputDataForCreateToken,
          collectionId,
          address: richAccountAddress,
          owner: richAccountAddress,
        });
      expect(createTokenResponse.parsed.tokenId).toEqual(expect.any(Number));

      const getTokenResponse: UniqueTokenDecodedResponse =
        await client.tokens.tokenById({
          collectionId,
          tokenId: createTokenResponse.parsed.tokenId,
        });
      expect(getTokenResponse.tokenId).toEqual(expect.any(Number));
    }, 100_000);
  });
});
