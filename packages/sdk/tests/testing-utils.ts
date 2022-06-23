import { cryptoWaitReady } from '@polkadot/util-crypto';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { HexString } from '@polkadot/util/types';
import { SdkOptions, SdkSigner } from '@unique-nft/sdk/types';
import { createSigner, SignerOptions } from '@unique-nft/sdk/sign';
import { Sdk } from '../src/lib/sdk';

export const getDefaultSdkOptions = (): SdkOptions => ({
  chainWsUrl: 'wss://ws-rc.unique.network',
});

export async function createSdk(signerOptions?: SignerOptions): Promise<Sdk> {
  const defOptions = getDefaultSdkOptions();
  const signer: SdkSigner | undefined = signerOptions
    ? await createSigner(signerOptions)
    : undefined;
  const options: SdkOptions = {
    chainWsUrl: defOptions.chainWsUrl,
    signer,
  };
  return Sdk.create(options);
}

export type TestAccounts = {
  alice: KeyringPair;
  bob: KeyringPair;
  charlie: KeyringPair;
  dave: KeyringPair;
  eve: KeyringPair;
  ferdie: KeyringPair;
};

export const getKeyringPairs = async (): Promise<TestAccounts> => {
  await cryptoWaitReady();
  const keyring = new Keyring({ type: 'sr25519' });

  return {
    alice: keyring.addFromUri('//Alice'),
    bob: keyring.addFromUri('//Bob'),
    charlie: keyring.addFromUri('//Charlie'),
    dave: keyring.addFromUri('//Dave'),
    eve: keyring.addFromUri('//Eve'),
    ferdie: keyring.addFromUri('//Ferdie'),
  };
};

export const getLastCollectionId = (sdk: Sdk): Promise<number> =>
  sdk.api.rpc.unique
    .collectionStats()
    .then(({ created }) => created.toNumber());

export const getLastTokenId = (
  sdk: Sdk,
  collectionId: number,
): Promise<number> =>
  sdk.api.rpc.unique
    .lastTokenId(collectionId)
    .then((tokenId) => tokenId.toNumber());

export const delay = (ms = 1000) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export function signWithAccount(
  sdk: Sdk,
  account: KeyringPair,
  signerPayloadHex: HexString,
): HexString {
  return sdk.extrinsics.packSignatureType(
    account.sign(signerPayloadHex),
    account.type,
  );
}
