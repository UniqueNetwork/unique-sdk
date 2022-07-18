import '../index';
import { createRichAccount, createSdk } from '../../testing';

describe('FungibleCollection', () => {
  it('create and get', async () => {
    const sdk = await createSdk(true);
    const account = createRichAccount();

    const collectionPartial = {
      name: 'Test fungible collection',
      description: 'just test',
      tokenPrefix: 'TEST',
      decimals: 10,
    };

    const {
      parsed: { collectionId },
    } = await sdk.fungible.createCollection.submitWaitResult({
      address: account.address,
      ...collectionPartial,
    });

    const collection = await sdk.fungible.getCollection({ collectionId });

    expect(collection).toMatchObject(collectionPartial);
  }, 30_000);
});
