import { KeyringPair } from '@polkadot/keyring/types';
import {
  delay,
  getLastTokenId,
  signWithAccount,
} from '@unique-nft/sdk/tests/testing-utils';
import { normalizeAddress } from '@unique-nft/sdk/utils';
import { Sdk } from '@unique-nft/sdk';
import { TokenInfo } from '@unique-nft/sdk/types';

async function findToken(
  sdk: Sdk,
  collectionId: number,
  name: string,
  tryCount = 0,
): Promise<TokenInfo | null> {
  const tokenId = await getLastTokenId(sdk, collectionId);
  const token = tokenId ? await sdk.token.get({ collectionId, tokenId }) : null;
  const constData = token?.properties?.constData as any;
  if (constData && constData.name === name) return token;
  if (tryCount < 10) {
    await delay(3_000);
    return findToken(sdk, collectionId, name, tryCount + 1);
  }
  return null;
}

export async function createToken(
  sdk: Sdk,
  collectionId: number,
  authorAccount: KeyringPair,
  ownerAccount?: KeyringPair,
): Promise<TokenInfo> {
  const constData = {
    name: `token_${Math.floor(Math.random() * 1000)}`,
    ipfsJson: 'aaa',
  };

  const txPayload = await sdk.token.create({
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

  const newToken: TokenInfo | null = await findToken(
    sdk,
    collectionId,
    constData.name,
  );

  expect(newToken).toMatchObject({
    owner: normalizeAddress(
      ownerAccount?.address || authorAccount.address,
      sdk.api.registry.chainSS58,
    ),
    properties: {
      constData,
    },
  });
  if (newToken == null) {
    throw new Error('Create token fail');
  }
  return newToken;
}
