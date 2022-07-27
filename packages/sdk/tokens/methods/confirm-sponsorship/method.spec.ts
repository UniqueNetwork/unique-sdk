import { Sdk } from '@unique-nft/sdk';
import {
  createCollection,
  createRichAccount,
  createSdk,
  TestAccount,
} from '@unique-nft/sdk/testing';
import {normalizeAddress} from '@unique-nft/sdk/utils';
import { ConfirmSponsorshipMutation, ConfirmSponsorshipArguments } from '.';
import {
  SetCollectionSponsorArguments,
  SetCollectionSponsorMutation,
} from '../set-collection-sponsor';

describe('confirm-sponsorship', () => {
  let sdk: Sdk;

  let richAccount: TestAccount;
  let newSponsorAccount: TestAccount;

  let setCollectionSponsor: SetCollectionSponsorMutation;
  let setCollectionSponsorArguments: SetCollectionSponsorArguments;

  let confirmSponsorship: ConfirmSponsorshipMutation;
  let confirmSponsorshipArguments: ConfirmSponsorshipArguments;

  let collectionId: number;

  beforeAll(async () => {
    sdk = await createSdk(true);

    richAccount = createRichAccount();
    newSponsorAccount = createRichAccount();

    const collection = await createCollection(sdk, richAccount);
    collectionId = collection.id;

    setCollectionSponsor = new SetCollectionSponsorMutation(sdk);
    confirmSponsorship = new ConfirmSponsorshipMutation(sdk);
  }, 60_000);

  it('transformArgs', async () => {
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
  });

  it('confirm sponsorship', async () => {
    setCollectionSponsorArguments = {
      collectionId,
      address: richAccount.address,
      newSponsor: newSponsorAccount.address,
    };
    await setCollectionSponsor.submitWaitResult(setCollectionSponsorArguments);

    confirmSponsorshipArguments = {
      collectionId,
      address: richAccount.address,
    };

    const confirmSponsorshipResult = await confirmSponsorship.submitWaitResult(confirmSponsorshipArguments);
    const { collectionId: resultCollectionId, sponsor: resultSponsor } =
      confirmSponsorshipResult.parsed;

    expect(collectionId).toEqual(resultCollectionId);
    expect(newSponsorAccount.address).toEqual(normalizeAddress(resultSponsor));
  }, 60_000);
});
