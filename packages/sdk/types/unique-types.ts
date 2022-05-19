// eslint-disable-next-line max-classes-per-file
import { AnyJson } from '@polkadot/types/types';
import { INamespace } from 'protobufjs';
import { ApiProperty } from '@nestjs/swagger';
import { DEFAULT_CONST_SCHEMA } from './constants';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;

export enum CollectionMode {
  Nft = 'Nft',
  Fungible = 'Fungible',
  ReFungible = 'ReFungible',
}

export enum CollectionAccess {
  Normal = 'Normal',
  AllowList = 'AllowList',
}

export enum CollectionSchemaVersion {
  ImageURL = 'ImageURL',
  Unique = 'Unique',
}

export enum MetaUpdatePermission {
  ItemOwner = 'ItemOwner',
  Admin = 'Admin',
  None = 'None',
}

export class CollectionSponsorship {
  @ApiProperty({
    description: 'The ss-58 encoded address',
    example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
  })
  address: string;

  @ApiProperty()
  isConfirmed: boolean;
}

export class CollectionLimits {
  @ApiProperty({ required: false })
  accountTokenOwnershipLimit?: number | null;

  @ApiProperty({ required: false })
  sponsoredDataSize?: number | null;

  @ApiProperty({ required: false })
  sponsoredDataRateLimit?: number | null;

  @ApiProperty({ required: false })
  tokenLimit?: number | null;

  @ApiProperty({ required: false })
  sponsorTransferTimeout?: number | null;

  @ApiProperty({ required: false })
  sponsorApproveTimeout?: number | null;

  @ApiProperty({ required: false })
  ownerCanTransfer?: boolean | null;

  @ApiProperty({ required: false })
  ownerCanDestroy?: boolean | null;

  @ApiProperty({ required: false })
  transfersEnabled?: boolean | null;
}

export class CollectionInfoBase {
  @ApiProperty({ enum: CollectionMode, required: false })
  mode?: CollectionMode | `${CollectionMode}`;

  @ApiProperty({ enum: CollectionAccess, required: false })
  access?: CollectionAccess | `${CollectionAccess}`;

  @ApiProperty({ enum: CollectionSchemaVersion, required: false })
  schemaVersion?: CollectionSchemaVersion | `${CollectionSchemaVersion}`;

  @ApiProperty({
    example: 'Sample collection name',
  })
  name: string;

  @ApiProperty({
    example: 'sample collection description',
  })
  description: string;

  @ApiProperty({
    example: 'TEST',
  })
  tokenPrefix: string;

  @ApiProperty({ required: false })
  mintMode?: boolean;

  @ApiProperty({
    required: false,
    example:
      'https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png',
  })
  offchainSchema?: string;

  @ApiProperty({ required: false })
  sponsorship?: CollectionSponsorship | null;

  @ApiProperty({ required: false })
  limits?: CollectionLimits;

  @ApiProperty({
    type: Object,
    example: JSON.stringify(DEFAULT_CONST_SCHEMA),
    required: false,
  })
  constOnChainSchema?: INamespace | null;

  @ApiProperty({ type: Object, required: false })
  variableOnChainSchema?: AnyJson | null;

  @ApiProperty({ enum: MetaUpdatePermission, required: false })
  metaUpdatePermission?: MetaUpdatePermission | `${MetaUpdatePermission}`;
}

export class CollectionInfo extends CollectionInfoBase {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The ss-58 encoded address',
    example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
  })
  owner: string;
}

export interface TokenInfo {
  id: number;
  collectionId: number;
  url: string | null;
  constData: AnyObject | null;
  variableData: string | null;
  owner: string;
}

export class TokenInfoDto implements TokenInfo {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The ss-58 encoded address',
    example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
  })
  owner: string;

  @ApiProperty({
    example: 1,
  })
  collectionId: number;

  @ApiProperty({
    example: {
      ipfsJson:
        '{"ipfs":"QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb","type":"image"}',
      gender: 'Male',
      traits: ['TEETH_SMILE', 'UP_HAIR'],
    },
  })
  constData: AnyObject | null;

  @ApiProperty({
    description: 'URL of the token content on IPFS node (if available)',
    example:
      'https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png',
  })
  url: string | null;

  variableData: string | null;
}

export type TokenPayload =
  | {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      NFT: any;
    }
  | {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      Fungible: any;
    }
  | {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      ReFungible: any;
    };
