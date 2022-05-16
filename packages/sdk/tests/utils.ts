import { cryptoWaitReady } from '@polkadot/util-crypto';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { SdkOptions } from '@unique-nft/sdk/types';
import { Sdk } from '../src/lib/sdk';

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

export const getDefaultSdkOptions = (): SdkOptions => ({
  chainWsUrl: 'wss://ws-quartz-dev.comecord.com',
  ipfsGatewayUrl: 'https://ipfs.unique.network/ipfs/',
});
