/**
 * @jest-environment node
 */
import { INestApplication } from '@nestjs/common';

import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/state-queries';
import '@unique-nft/sdk/extrinsics';

import {
  CollectionInfoWithSchemaResponse,
  CreateCollectionParsed,
  ExtrinsicResultResponse,
  TokenId,
  UniqueTokenDecodedResponse,
} from '../types';
import { createWeb, createClient, createRichAccount } from './utils.test';
import {
  inputDataForCreateCollection,
  inputDataForCreateToken,
} from './values';

describe('client tests', () => {
  let app: INestApplication;
  let richAccountAddress: string;
  let client;

  beforeAll(async () => {
    if (!app) {
      app = await createWeb();
    }

    client = await createClient(true);
    richAccountAddress = createRichAccount().address;
  }, 100_000);

  afterAll(() => {
    app.close();
  });

  describe('collections and tokens', () => {
    it('create and get', async () => {
      const createCollectionResponse: ExtrinsicResultResponse<CreateCollectionParsed> =
        await client.collections.creation.submitWaitResult(
          inputDataForCreateCollection,
        );
      expect(createCollectionResponse.parsed.collectionId).toEqual(
        expect.any(Number),
      );
      const { collectionId } = createCollectionResponse.parsed;

      const getCollectionResponse: CollectionInfoWithSchemaResponse =
        await client.collections.get({
          collectionId,
        });
      expect(getCollectionResponse.id).toEqual(expect.any(Number));

      const createTokenResponse: ExtrinsicResultResponse<TokenId> =
        await client.tokens.create.submitWaitResult({
          ...inputDataForCreateToken,
          collectionId,
          address: richAccountAddress,
          owner: richAccountAddress,
        });
      expect(createTokenResponse.parsed.tokenId).toEqual(expect.any(Number));

      const getTokenResponse: UniqueTokenDecodedResponse =
        await client.tokens.get({
          collectionId,
          tokenId: createTokenResponse.parsed.tokenId,
        });
      expect(getTokenResponse.tokenId).toEqual(expect.any(Number));
    }, 100_000);
  });
});
