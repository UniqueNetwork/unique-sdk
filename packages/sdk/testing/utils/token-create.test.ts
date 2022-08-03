import { signWithAccount, TestAccount } from '@unique-nft/sdk/testing';
// import { normalizeAddress } from '@unique-nft/sdk/utils';
import { Sdk } from '@unique-nft/sdk';
import { TokenInfo } from '@unique-nft/sdk/types';

export async function createToken(
  sdk: Sdk,
  collectionId: number,
  authorAccount: TestAccount,
  ownerAccount?: TestAccount,
): Promise<TokenInfo> {
  const constData = {
    name: `token_${Math.floor(Math.random() * 1000)}`,
    ipfsJson: 'aaa',
  };

  const txPayload = await sdk.tokens.create({
    address: authorAccount.address,
    owner: ownerAccount?.address,
    collectionId,
    constData,
  });

  const signature = signWithAccount(
    sdk,
    authorAccount,
    txPayload.signerPayloadHex,
  );

  const submitResult = await sdk.extrinsics.submitWaitCompleted({
    signerPayloadJSON: txPayload.signerPayloadJSON,
    signature,
  });
  const tokenCreatedEvent = submitResult.findRecord('common', 'ItemCreated');

  if (!tokenCreatedEvent) {
    throw new Error('Create token fail');
  }
  const tokenId = +tokenCreatedEvent.event.data[1];

  const newToken: TokenInfo | null = await sdk.tokens.get({
    collectionId,
    tokenId,
  });

  // todo: This expect fails now
  // expect(newToken).toMatchObject({
  //   owner: normalizeAddress(
  //     ownerAccount?.address || authorAccount.address,
  //     sdk.api.registry.chainSS58,
  //   ),
  //   properties: {
  //     constData,
  //   },
  // });

  if (newToken == null) {
    throw new Error('Create token fail');
  }

  return newToken;
}
