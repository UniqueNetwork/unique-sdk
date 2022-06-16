import {
  createSdk,
  getKeyringPairs,
  TestAccounts,
  TestCollectionInitial,
} from '@unique-nft/sdk/tests';
import {
  CollectionFieldTypes,
  CreateCollectionArguments,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { Sdk } from '@unique-nft/sdk';
import { createCollectionEx } from './method';

describe('create-collection', () => {
  let sdk: Sdk;
  let testAccounts: TestAccounts;
  let createCollectionExMethod: (
    args: CreateCollectionArguments,
  ) => Promise<UnsignedTxPayload>;

  beforeAll(async () => {
    sdk = await createSdk();

    testAccounts = await getKeyringPairs();

    createCollectionExMethod = createCollectionEx.bind(sdk);
  });

  it('ok', async () => {
    const collectionData: TestCollectionInitial = {
      name: `foo_${Math.floor(Math.random() * 1000)}`,
      description: 'bar',
      tokenPrefix: 'BAZ',
      properties: {
        fields: [
          {
            type: CollectionFieldTypes.TEXT,
            name: 'field1',
            required: true,
          },
          {
            type: CollectionFieldTypes.SELECT,
            name: 'field2',
            required: false,
            items: ['a', 'b', 'c'],
          },
        ],
      },
    };

    const result: UnsignedTxPayload = await createCollectionExMethod({
      address: testAccounts.bob.address,
      ...collectionData,
    });
    expect(result).toMatchObject({
      signerPayloadJSON: expect.any(Object),
      signerPayloadRaw: expect.any(Object),
      signerPayloadHex: expect.any(String),
    });
  });
});
