import { Sdk } from '@unique-nft/sdk';
import {
  createCollection,
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import { normalizeAddress } from "@unique-nft/sdk/utils";
import { SetCollectionSponsorMutation, SetCollectionSponsorArguments } from '.';

describe('set-collection-sponsor', () => {
  let sdk: Sdk;

  let richAccount: TestAccount;
  let newSponsorAccount: TestAccount;

  let setCollectionSponsor: SetCollectionSponsorMutation;
  let setCollectionSponsorArguments: SetCollectionSponsorArguments;

  let collectionId: number;

  beforeAll(async () => {
    sdk = await createSdk(true);

    richAccount = createRichAccount();
    newSponsorAccount = createRichAccount();

    const collection = await createCollection(sdk, richAccount);
    collectionId = collection.id;

    setCollectionSponsor = new SetCollectionSponsorMutation(sdk);
  }, 60_000);

  it('transformArgs', async () => {
    setCollectionSponsorArguments = {
      collectionId,
      address: richAccount.address,
      newSponsor: newSponsorAccount.address,
    };
    const transformed = await setCollectionSponsor.transformArgs(setCollectionSponsorArguments);

    expect(transformed).toMatchObject({
      address: setCollectionSponsorArguments.address,
      section: 'unique',
      method: 'setCollectionSponsor',
      args: [
        setCollectionSponsorArguments.collectionId,
        setCollectionSponsorArguments.newSponsor,
      ],
    });
  });

  it('set sponsor of collection', async () => {
    setCollectionSponsorArguments = {
      collectionId,
      address: richAccount.address,
      newSponsor: newSponsorAccount.address,
    };

    const setCollectionSponsorResult = await setCollectionSponsor.submitWaitResult(setCollectionSponsorArguments);
    const { collectionId: resultCollectionId, sponsor: resultSponsor } =
       setCollectionSponsorResult.parsed;

    expect(collectionId).toEqual(resultCollectionId);
    expect(newSponsorAccount.address).toEqual(normalizeAddress(resultSponsor));
  }, 60_000);
});
