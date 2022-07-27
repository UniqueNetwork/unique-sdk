import { Sdk } from '@unique-nft/sdk';
import {
  createCollection,
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { RemoveCollectionSponsorMutation, RemoveCollectionSponsorArguments } from '.';
import { SetCollectionSponsorMutation, SetCollectionSponsorArguments } from '../set-collection-sponsor';

describe('remove-collection-sponsor', () => {
  let sdk: Sdk;

  let richAccount: TestAccount;
  let newSponsorAccount: TestAccount;

  let setCollectionSponsor: SetCollectionSponsorMutation;
  let setCollectionSponsorArguments: SetCollectionSponsorArguments;

  let removeCollectionSponsor: RemoveCollectionSponsorMutation;
  let removeCollectionSponsorArguments: RemoveCollectionSponsorArguments;

  let collectionId: number;

  beforeAll(async () => {
    sdk = await createSdk(true);

    richAccount = createRichAccount();
    newSponsorAccount = createRichAccount();

    const collection = await createCollection(sdk, richAccount);
    collectionId = collection.id;

    setCollectionSponsor = new SetCollectionSponsorMutation(sdk);
    removeCollectionSponsor = new RemoveCollectionSponsorMutation(sdk);
  }, 60_000);

  it('transformArgs', async () => {
    removeCollectionSponsorArguments = {
      collectionId,
      address: richAccount.address,
    };
    const transformed = await removeCollectionSponsor.transformArgs(removeCollectionSponsorArguments);

    expect(transformed).toMatchObject({
      address: removeCollectionSponsorArguments.address,
      section: 'unique',
      method: 'removeCollectionSponsor',
      args: [
        removeCollectionSponsorArguments.collectionId,
      ],
    });
  });

  it('remove sponsor of collection', async () => {
    setCollectionSponsorArguments = {
      collectionId,
      address: richAccount.address,
      newSponsor: newSponsorAccount.address,
    };
    await setCollectionSponsor.submitWaitResult(setCollectionSponsorArguments);

    removeCollectionSponsorArguments = {
      collectionId,
      address: richAccount.address,
    };

    const removeCollectionSponsorResult = await removeCollectionSponsor.submitWaitResult(removeCollectionSponsorArguments);

    const { collectionId: resultCollectionId } =
      removeCollectionSponsorResult.parsed;

    expect(collectionId).toEqual(resultCollectionId);
  }, 60_000);
});
