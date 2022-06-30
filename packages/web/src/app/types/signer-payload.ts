/* eslint-disable max-classes-per-file */

import { KeyringPair$Meta, KeyringPair$Json } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { IsEnum, IsOptional } from 'class-validator';
import {
  SignerPayloadJSON,
  SignerPayloadRaw,
} from '@polkadot/types/types/extrinsic';
import { ApiProperty } from '@nestjs/swagger';
import { SignatureType } from '@unique-nft/sdk/types';
import {
  Account,
  GenerateAccountArguments,
  GetAccountArguments,
} from '@unique-nft/account';
import { EncryptedJsonDescriptor } from '@polkadot/util-crypto/json/types';
import { ValidMnemonic } from '../validation';

export class GenerateAccountBody implements GenerateAccountArguments {
  @ApiProperty({
    description:
      "The password will be used to encrypt the account's information. But if someone knows your seed phrase they still have control over your account",
    required: false,
  })
  @IsOptional()
  password?: string;

  @ApiProperty({
    description:
      'Signature: ed25519, sr25519 implementation using Schnorr signatures. ECDSA signatures on the secp256k1 curve',
    enum: SignatureType,
    required: false,
  })
  @IsOptional()
  @IsEnum(SignatureType)
  pairType?: SignatureType;

  @ApiProperty({
    description:
      'A metadata argument that contains account information (that may be obtained from the json file of an account backup)',
    required: false,
    type: 'object',
    example: {},
  })
  @IsOptional()
  meta?: KeyringPair$Meta;
}
export class GetAccountQuery
  extends GenerateAccountBody
  implements GetAccountArguments
{
  @ApiProperty({
    description: 'The mnemonic seed gives full access to your account',
    example:
      'little crouch armed put judge bamboo avoid fine actor soccer rebuild cluster',
  })
  @ValidMnemonic()
  mnemonic: string;
}

export class KeyringPair$JsonDto implements KeyringPair$Json {
  @ApiProperty({
    example:
      'MFMCAQEwBQYDK2VwBCIEILbppIGq00fUiwaILydGVc6iwMRuhf4ChC/nr7j4dzl5Kg31MzrinKtrkxSLXWvax73fnO9pWCuWC8R5Hsg/0xahIwMhACoN9TM64pyra5MUi11r2se935zvaVgrlgvEeR7IP9MW',
  })
  encoded: HexString | string;

  @ApiProperty({
    example: {
      content: ['pkcs8', 'ed25519'],
      type: ['none'],
      version: '3',
    },
  })
  encoding: EncryptedJsonDescriptor;

  @ApiProperty({
    example: '5D1r1oYvhenhKT46RhizM6ExizbdvLvcF2ZFo1Swt6Lezhhq',
  })
  address: string | HexString;

  @ApiProperty({
    example: {},
  })
  meta: KeyringPair$Meta;
}

export class AccountResponse implements Account {
  @ApiProperty({
    description: 'The mnemonic seed gives full access to your account',
    example:
      'little crouch armed put judge bamboo avoid fine actor soccer rebuild cluster',
  })
  mnemonic: string;

  @ApiProperty({
    description: 'The private key generated from the mnemonic',
    example:
      '0xb6e9a481aad347d48b06882f274655cea2c0c46e85fe02842fe7afb8f8773979',
  })
  seed: HexString;

  @ApiProperty({
    description:
      'The public key generated from the mnemonic. The SS58 address is based on the public key (aka "Account ID")',
    example:
      '0x653bc0139ae6a8fd15db2f176fb3cc002b1ea53841379593c7a6ebb7b80ee751',
  })
  publicKey: HexString;

  @ApiProperty({
    description:
      'A JSON object containing the metadata associated with an account',
    type: KeyringPair$JsonDto,
  })
  keyfile: KeyringPair$Json;
}

export class SignerPayloadJSONDto implements SignerPayloadJSON {
  @ApiProperty({
    description: 'The ss-58 encoded address',
    example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
  })
  address: string;

  @ApiProperty({
    description: 'The checkpoint hash of the block, in hex',
  })
  blockHash: string;

  @ApiProperty({
    description: 'The checkpoint block number, in hex',
  })
  blockNumber: string;

  @ApiProperty({
    description: 'The era for this transaction, in hex',
  })
  era: string;

  @ApiProperty({
    description: 'The genesis hash of the chain, in hex',
  })
  genesisHash: string;

  @ApiProperty({
    description: 'The encoded method (with arguments) in hex',
  })
  method: string;

  @ApiProperty({
    description: 'The nonce for this transaction, in hex',
  })
  nonce: string;

  @ApiProperty({
    description: 'The current spec version for the runtime',
  })
  specVersion: string;

  @ApiProperty({
    description: 'The tip for this transaction, in hex',
  })
  tip: string;

  @ApiProperty({
    description: 'The current transaction version for the runtime',
  })
  transactionVersion: string;

  @ApiProperty({
    description: 'The applicable signed extensions for this runtime',
  })
  signedExtensions: string[];

  @ApiProperty({
    description: 'The version of the extrinsic we are dealing with',
  })
  version: number;
}

export class SignerPayloadRawDto implements SignerPayloadRaw {
  @ApiProperty({
    description: 'The ss-58 encoded address',
    example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
  })
  address: string;

  @ApiProperty({
    description: 'The hex-encoded data for this request',
  })
  data: string;

  @ApiProperty({
    enum: ['bytes', 'payload'],
    description: 'The type of the contained data',
  })
  type: 'bytes' | 'payload';
}
