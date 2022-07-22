// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { KeyringPair$Meta, KeyringPair$Json } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';

export interface UnsignedTxPayload {
  signerPayloadJSON: SignerPayloadJSON;
  signerPayloadRaw: SignerPayloadRaw;
  signerPayloadHex: HexString;
}

export interface SdkSigner {
  sign(unsignedTxPayload: UnsignedTxPayload): Promise<SignResult>;
}

export enum SignatureType {
  Sr25519 = 'sr25519',
  Ed25519 = 'ed25519',
  Ecdsa = 'ecdsa',
  Ethereum = 'ethereum',
}

export interface SignResult {
  signatureType: SignatureType;
  signature: HexString;
}

export interface GenerateAccountDataArguments {
  pairType?: SignatureType;
  meta?: KeyringPair$Meta;
}
export interface GetAccountDataArguments extends GenerateAccountDataArguments {
  mnemonic: string;
}

export interface AccountData {
  mnemonic: string;

  seed: HexString;

  publicKey: HexString;

  keyfile: KeyringPair$Json;
}

export abstract class Account<T = unknown> {
  abstract getSigner(): SdkSigner;
  protected constructor(public instance: T) {}
}

export abstract class Provider<A = unknown, I = unknown> extends Object {
  protected instance: I;

  abstract init(): Promise<void>;

  abstract getAccounts(): Promise<Account<A>[]>;

  public async first(): Promise<Account | undefined> {
    const accounts = await this.getAccounts();
    return accounts.length ? accounts[0] : undefined;
  }
}

export type ProviderClass<T extends Provider> = { new (o?: any): T };
