import { KeyringPair } from '@polkadot/keyring/types';
import { delay, signWithAccount } from '@unique-nft/sdk/tests/testing-utils';
import { normalizeAddress } from '@unique-nft/sdk/utils';
import { Sdk } from '@unique-nft/sdk';
import { TokenInfo } from '@unique-nft/sdk/types';

const constData = { ipfsJson: 'aaa', name: 'bbb' };

export async function createToken(
  sdk: Sdk,
  collectionId: number,
  tokenId: number,
  authorAccount: KeyringPair,
  ownerAccount?: KeyringPair,
): Promise<TokenInfo> {
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

  await sdk.extrinsics.submit({
    signerPayloadJSON: txPayload.signerPayloadJSON,
    signature,
  });

  await delay(30_000);

  const newToken: TokenInfo | null = await sdk.tokens.get({
    collectionId,
    tokenId,
  });
  expect(newToken).toMatchObject({
    owner: normalizeAddress(
      ownerAccount?.address || authorAccount.address,
      sdk.api.registry.chainSS58,
    ),
    constData,
  });
  if (newToken == null) {
    throw new Error('invalid token');
  }
  return newToken;
}
