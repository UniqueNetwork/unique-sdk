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
} from '../types/api';
import { createWeb } from './utils.test';
import { inputDataForCreateCollection } from './values';

const baseUrl = process.env.TEST_WEB_APP_URL || 'http://localhost:3001';
const TEST_RICH_ACCOUNT = process.env['TEST_RICH_ACCOUNT'] || '//Bob'; // eslint-disable-line
const TEST_POOR_ACCOUNT = process.env['TEST_POOR_ACCOUNT'] || '//Alice'; // eslint-disable-line

describe('client tests', () => {
  let app: INestApplication;
  let richAccountAddress: string;
  let poorAccountAddress: string;
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
    const poorAccount = keyringProvider.addSeed(TEST_POOR_ACCOUNT);
    poorAccountAddress = poorAccount.instance.address;
    signer = richAccount.getSigner();
  }, 100_000);

  afterAll(() => {
    app.close();
  });

  describe('collections', () => {
    it('get collection', async () => {
      const client = new Client({ baseUrl, signer: null });
      const response: CollectionInfoWithSchemaResponse =
        await client.collections.collectionByIdFn({
          collectionId: 10,
        });
      expect(response.id).toEqual(expect.any(Number));
    }, 100_000);

    it('create collection', async () => {
      const client = new Client({ baseUrl, signer });
      const response: ExtrinsicResultResponse<CreateCollectionParsed> =
        await client.collections.createCollectionEx.submitWaitResult(
          inputDataForCreateCollection,
        );
      expect(response.parsed.collectionId).toEqual(expect.any(Number));
    }, 100_000);
  });
});
