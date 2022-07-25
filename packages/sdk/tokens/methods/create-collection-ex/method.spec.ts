import { Sdk } from '@unique-nft/sdk';
import { createSdk } from '@unique-nft/sdk/testing';

import { CreateCollectionExMutation } from './method';
import { CreateCollectionArguments } from './types';

describe('create-collection-ex', () => {
  let sdk: Sdk;

  let creation: CreateCollectionExMutation;

  let createArgs: CreateCollectionArguments;

  beforeAll(async () => {
    sdk = await createSdk(true);

    creation = new CreateCollectionExMutation(sdk);

    createArgs = {
      address: '123',
      name: `foo_${Math.floor(Math.random() * 1000)}`,
      description: 'bar',
      tokenPrefix: 'BAZ',
      properties: {},
    };
  });

  it('transformArgs', async () => {
    const transformed = await creation.transformArgs(createArgs);

    expect(transformed).toMatchObject({
      address: createArgs.address,
      section: 'unique',
      method: 'createCollectionEx',
      args: [expect.any(String)],
    });
  });
});
