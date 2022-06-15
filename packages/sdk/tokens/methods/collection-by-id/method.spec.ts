import {
  CollectionFieldTypes,
  CollectionIdArguments,
  CollectionInfo,
} from '@unique-nft/sdk/types';
import { Sdk } from '@unique-nft/sdk';
import {
  createSdk,
  getKeyringPairs,
  createCollection,
  TestAccounts,
  TestCollectionInitial,
} from '@unique-nft/sdk/tests';
import { collectionById } from './method';

describe('collection-by-id', () => {
  let sdk: Sdk;
  let testAccounts: TestAccounts;
  let collectionByIdMethod: (
    args: CollectionIdArguments,
  ) => Promise<CollectionInfo | null>;

  beforeAll(async () => {
    sdk = await createSdk();

    testAccounts = await getKeyringPairs();

    collectionByIdMethod = collectionById.bind(sdk);
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

    const { id: collectionId } = await createCollection(
      sdk,
      testAccounts.bob,
      collectionData,
    );

    const newCollection = await collectionByIdMethod({ collectionId });

    expect(newCollection).toMatchObject(collectionData);
  }, 30_000);

  it('null', async () => {
    const newCollection = await collectionByIdMethod({ collectionId: 0 });

    expect(newCollection).toBeNull();
  });

  it('fail', async () => {
    await expect(async () => {
      await collectionByIdMethod({ collectionId: -1 });
    }).rejects.toThrow();
  });
});
