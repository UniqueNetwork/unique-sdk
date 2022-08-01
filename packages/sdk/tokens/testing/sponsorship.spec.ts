import { Sdk } from '@unique-nft/sdk';
import {
  createCollection,
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import {
  ConfirmSponsorshipArguments,
  ConfirmSponsorshipMutation,
} from '@unique-nft/sdk/tokens/methods/confirm-sponsorship';
import {
  RemoveCollectionSponsorArguments,
  RemoveCollectionSponsorMutation,
} from "@unique-nft/sdk/tokens/methods/remove-collection-sponsor";
import {normalizeAddress} from "@unique-nft/sdk/utils";
import {
  SetCollectionSponsorArguments,
  SetCollectionSponsorMutation,
} from "@unique-nft/sdk/tokens/methods/set-collection-sponsor";

describe('Collection sponsorship', () => {
  let sdk: Sdk;

  let richAccount: TestAccount;
  let newSponsorAccount: TestAccount;

  let setCollectionSponsor: SetCollectionSponsorMutation;
  let setCollectionSponsorArguments: SetCollectionSponsorArguments;

  let confirmSponsorship: ConfirmSponsorshipMutation;
  let confirmSponsorshipArguments: ConfirmSponsorshipArguments;

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
    confirmSponsorship = new ConfirmSponsorshipMutation(sdk);
    removeCollectionSponsor = new RemoveCollectionSponsorMutation(sdk);
  }, 60_000);

  it('set sponsor of collection', async () => {
    setCollectionSponsorArguments = {
      collectionId,
      address: richAccount.address,
      newSponsor: newSponsorAccount.address,
    };

    const setCollectionSponsorResult = await setCollectionSponsor.submitWaitResult(setCollectionSponsorArguments);
    const {collectionId: resultCollectionId, sponsor: resultSponsor} =
      setCollectionSponsorResult.parsed;

    expect(collectionId).toEqual(resultCollectionId);
    expect(newSponsorAccount.address).toEqual(normalizeAddress(resultSponsor));
  }, 60_000);

  it('confirm sponsor of collection', async () => {
    confirmSponsorshipArguments = {
      collectionId,
      address: richAccount.address,
    };
    const transformed = await confirmSponsorship.transformArgs(confirmSponsorshipArguments);

    expect(transformed).toMatchObject({
      address: confirmSponsorshipArguments.address,
      section: 'unique',
      method: 'confirmSponsorship',
      args: [
        confirmSponsorshipArguments.collectionId,
      ],
    });
  }, 60_000);

  it('remove sponsor of collection', async () => {

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
