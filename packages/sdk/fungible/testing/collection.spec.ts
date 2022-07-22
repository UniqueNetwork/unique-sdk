import { CollectionSchemaName } from '@unique-nft/sdk/tokens';
import { createPoorAccount, createRichAccount, createSdk } from '../../testing';
import '../index';

describe('FungibleCollection', () => {
  it('create and get', async () => {
    const sdk = await createSdk(true);
    const richAccount = createRichAccount();
    const poorAccount = createPoorAccount();

    const collectionPartial = {
      name: 'Test fungible collection',
      description: 'just test',
      tokenPrefix: 'TEST',
      decimals: 5,
    };

    const {
      parsed: { collectionId },
    } = await sdk.fungible.createCollection.submitWaitResult({
      address: richAccount.address,
      ...collectionPartial,
      schema: {
        attributesSchema: {},
        attributesSchemaVersion: '1.0.0',
        coverPicture: {
          urlInfix: 'string',
          hash: 'string',
        },
        image: {
          urlTemplate: 'https://ipfs.unique.network/ipfs/{infix}.ext',
        },
        schemaName: CollectionSchemaName.unique,
        schemaVersion: '1.0.0',
      },
    });

    const collection = await sdk.fungible.getCollection({ collectionId });

    expect(collection).toMatchObject(collectionPartial);

    await sdk.fungible.addTokens.submitWaitResult({
      address: richAccount.address,
      amount: 999999,
      collectionId,
    });

    await sdk.fungible.transferTokens.submitWaitResult({
      address: richAccount.address,
      amount: 0.1,
      collectionId,
      recipient: poorAccount.address,
    });

    const richBalance = await sdk.fungible.getBalance({
      collectionId,
      address: richAccount.address,
    });

    const poorBalance = await sdk.fungible.getBalance({
      collectionId,
      address: poorAccount.address,
    });

    expect(richBalance).toEqual({
      raw: '989999',
      amount: '9.89999',
      formatted: '9.8999',
      decimals: 5,
      unit: 'TEST',
    });

    expect(poorBalance).toEqual({
      raw: '10000',
      amount: '0.10000',
      formatted: '100.0000 m',
      decimals: 5,
      unit: 'TEST',
    });
  }, 120_000);
});
