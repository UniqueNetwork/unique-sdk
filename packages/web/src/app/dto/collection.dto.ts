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
  MetaUpdatePermission,
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
  accountTokenOwnershipLimit: number;

  sponsoredDataSize: number | null;

  sponsoredDataRateLimit: number | null;

  tokenLimit: number | null;

  sponsorTransferTimeout: number | null;

  sponsorApproveTimeout: number | null;

  ownerCanTransfer: boolean | null;

  ownerCanDestroy: boolean | null;

  transfersEnabled: boolean | null;
}

class CollectionSponsorshipDto implements CollectionSponsorship {
  /**
   * @description The ss-58 encoded address
   * @example 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm'
   */
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
  constOnChainSchema: any | null;

  description: string;

  limits: CollectionLimitsDto;

  metaUpdatePermission: MetaUpdatePermission | `${MetaUpdatePermission}`;

  mintMode: boolean;

  name: string;

  /**
   * @example https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png
   */
  offchainSchema: string;

  /**
   * @description The ss-58 encoded address
   * @example 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm'
   */
  owner: string;

  sponsorship: CollectionSponsorshipDto | null;

  tokenPrefix: string;

  @ApiProperty({ type: Object })
  variableOnChainSchema: AnyJson | null;
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

  @ApiProperty({ enum: MetaUpdatePermission })
  metaUpdatePermission?: MetaUpdatePermission | `${MetaUpdatePermission}`;

  mintMode?: boolean;

  /**
   * @example https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png
   */
  offchainSchema?: string;

  sponsorship?: CollectionSponsorshipDto;

  @ApiProperty({ type: Object })
  variableOnChainSchema?: AnyJson;
}

export class BurnCollectionDto implements BurnCollectionArgs {
  /**
   * @description The ss-58 encoded address
   * @example 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm'
   */
  address: string;

  collectionId: number;
}

export class TransferCollectionDto implements TransferCollectionArgs {
  collectionId: number;

  from: string;

  to: string;
}
