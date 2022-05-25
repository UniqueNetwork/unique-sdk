// eslint-disable-next-line max-classes-per-file
import { AnyJson } from '@polkadot/types/types';
import { INamespace } from 'protobufjs';
import { ApiProperty } from '@nestjs/swagger';
import { DEFAULT_CONST_SCHEMA } from './constants';
import {
  CollectionAccess,
  CollectionInfoBase,
  CollectionLimits,
  CollectionMode,
  CollectionSchemaVersion,
  MetaUpdatePermission,
  TokenInfo,
} from '@unique-nft/sdk/types';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;

export class CollectionSponsorship {
  @ApiProperty({
    description: 'The ss-58 encoded address',
    example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
  })
  address: string;

  @ApiProperty()
  isConfirmed: boolean;
}

const CollectionLimitItem = ApiProperty({ required: false, example: null });

export class CollectionLimitsDto implements CollectionLimits {
  @CollectionLimitItem
  accountTokenOwnershipLimit?: number | null;

  @CollectionLimitItem
  sponsoredDataSize?: number | null;

  @CollectionLimitItem
  sponsoredDataRateLimit?: number | null;

  @CollectionLimitItem
  tokenLimit?: number | null;

  @CollectionLimitItem
  sponsorTransferTimeout?: number | null;

  @CollectionLimitItem
  sponsorApproveTimeout?: number | null;

  @CollectionLimitItem
  ownerCanTransfer?: boolean | null;

  @CollectionLimitItem
  ownerCanDestroy?: boolean | null;

  @CollectionLimitItem
  transfersEnabled?: boolean | null;
}

export class CollectionInfoBaseDto implements CollectionInfoBase {
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

export class CollectionInfoResponse extends CollectionInfoBaseDto {
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
    example: 100,
  })
  tokensCount: number;
}

export class TokenInfoResponse implements TokenInfo {
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
