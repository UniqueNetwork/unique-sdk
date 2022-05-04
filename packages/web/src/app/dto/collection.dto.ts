import type {
  CollectionInfo,
  CollectionLimits,
  CollectionSponsorship,
  CollectionIdArg,
  TokenIdArg,
  CreateCollectionArgs,
  BurnCollectionArgs,
  TransferCollectionArgs,
  AnyJson,
} from '@unique-nft/sdk';
import { ApiProperty } from '@nestjs/swagger';

import {
  CollectionAccess,
  CollectionSchemaVersion,
  CollectionMode,
  DEFAULT_CONST_SCHEMA,
} from '@unique-nft/sdk';

export class CollectionGetRequest implements CollectionIdArg {
  /**
   * @example 1
   */
  collectionId: number;
}

export class TokenGetRequest implements TokenIdArg {
  /**
   * @example 1
   */
  collectionId: number;

  /**
   * @example 1
   */
  tokenId: number;
}

class CollectionLimitsDto implements CollectionLimits {
  accountTokenOwnershipLimit?: number;

  sponsoredDataSize?: number;

  sponsoredDataRateLimit?: number;

  tokenLimit?: number;

  sponsorTransferTimeout?: number;

  sponsorApproveTimeout?: number;

  ownerCanTransfer?: boolean;

  ownerCanDestroy?: boolean;

  transfersEnabled?: boolean;
}

class CollectionSponsorshipDto implements CollectionSponsorship {
  address: string;

  isConfirmed: boolean;
}

export class CollectionResponse implements CollectionInfo {
  id: number;

  @ApiProperty({ enum: CollectionMode })
  mode: CollectionMode | `${CollectionMode}`;

  @ApiProperty({ enum: CollectionAccess })
  access: CollectionAccess | `${CollectionAccess}`;

  @ApiProperty({ enum: CollectionSchemaVersion })
  schemaVersion: CollectionSchemaVersion | `${CollectionSchemaVersion}`;

  @ApiProperty({ type: Object, example: JSON.stringify(DEFAULT_CONST_SCHEMA) })
  constOnChainSchema?: any;

  description: string;

  limits: CollectionLimitsDto;

  metaUpdatePermission: string;

  mintMode: boolean;

  name: string;

  offchainSchema: string;

  owner: string;

  sponsorship?: CollectionSponsorshipDto;

  tokenPrefix: string;

  @ApiProperty({ type: Object })
  variableOnChainSchema?: AnyJson;
}

export class CreateCollectionDto implements CreateCollectionArgs {
  /**
   * @description The ss-58 encoded address
   * @example 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm'
   */
  address: string;

  /**
   * @example 'Sample collection name'
   */
  name: string;

  /**
   * @example 'sample collection description'
   */
  description: string;

  /**
   * @example 'TEST'
   */
  tokenPrefix: string;

  @ApiProperty({ enum: CollectionMode })
  mode?: CollectionMode | `${CollectionMode}`;

  @ApiProperty({ enum: CollectionAccess })
  access?: CollectionAccess | `${CollectionAccess}`;

  @ApiProperty({ enum: CollectionSchemaVersion })
  schemaVersion?: CollectionSchemaVersion | `${CollectionSchemaVersion}`;

  @ApiProperty({ type: Object, example: JSON.stringify(DEFAULT_CONST_SCHEMA) })
  constOnChainSchema?: AnyJson;

  limits?: CollectionLimitsDto;

  metaUpdatePermission?: string;

  mintMode?: boolean;

  offchainSchema?: string;

  sponsorship?: CollectionSponsorshipDto;

  @ApiProperty({ type: Object })
  variableOnChainSchema?: AnyJson;
}

export class BurnCollectionDto implements BurnCollectionArgs {
  address: string;

  collectionId: number;
}

export class TransferCollectionDto implements TransferCollectionArgs {
  collectionId: number;

  from: string;

  to: string;
}
