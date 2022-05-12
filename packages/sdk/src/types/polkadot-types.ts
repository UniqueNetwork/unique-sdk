// eslint-disable-next-line max-classes-per-file
import { Header, Index } from '@polkadot/types/interfaces';
import {
  SignerPayloadJSON,
  SignerPayloadRaw,
} from '@polkadot/types/types/extrinsic';
import { ApiProperty } from '@nestjs/swagger';

export { HexString } from '@polkadot/util/types';
export { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
export { AnyJson } from '@polkadot/types/types';

export interface SingingInfo {
  header: Header | null;
  mortalLength: number;
  nonce: Index;
}

export enum SignatureType {
  Sr25519 = 'sr25519',
  Ed25519 = 'ed25519',
  Ecdsa = 'ecdsa',
  Ethereum = 'ethereum',
}

export class SignerPayloadJSONDto implements SignerPayloadJSON {
  /**
   * @description The ss-58 encoded address
   * @example 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm'
   */
  @ApiProperty()
  address: string;

  /**
   * @description The checkpoint hash of the block, in hex
   */
  @ApiProperty()
  blockHash: string;

  /**
   * @description The checkpoint block number, in hex
   */
  @ApiProperty()
  blockNumber: string;

  /**
   * @description The era for this transaction, in hex
   */
  @ApiProperty()
  era: string;

  /**
   * @description The genesis hash of the chain, in hex
   */
  @ApiProperty()
  genesisHash: string;

  /**
   * @description The encoded method (with arguments) in hex
   */
  @ApiProperty()
  method: string;

  /**
   * @description The nonce for this transaction, in hex
   */
  @ApiProperty()
  nonce: string;

  /**
   * @description The current spec version for the runtime
   */
  @ApiProperty()
  specVersion: string;

  /**
   * @description The tip for this transaction, in hex
   */
  @ApiProperty()
  tip: string;

  /**
   * @description The current transaction version for the runtime
   */
  @ApiProperty()
  transactionVersion: string;

  /**
   * @description The applicable signed extensions for this runtime
   */
  @ApiProperty()
  signedExtensions: string[];

  /**
   * @description The version of the extrinsic we are dealing with
   */
  @ApiProperty()
  version: number;
}

export class SignerPayloadRawDto implements SignerPayloadRaw {
  /**
   * @description The ss-58 encoded address
   * @example 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm'
   */
  @ApiProperty()
  address: string;

  /**
   * @description The hex-encoded data for this request
   */
  @ApiProperty()
  data: string;

  /**
   * @description The type of the contained data
   */
  @ApiProperty({ enum: ['bytes', 'payload'] })
  type: 'bytes' | 'payload';
}
