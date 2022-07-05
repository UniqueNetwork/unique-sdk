// eslint-disable-next-line max-classes-per-file
import { INamespace } from 'protobufjs';
import { ApiProperty, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import {
  CollectionFieldTypes,
  CollectionSchemaVersion,
  TokenInfo,
  TokenProperties,
  TokenPropertyPermissions,
} from '@unique-nft/sdk/types';
import {
  CollectionAccess,
  CollectionInfoBase,
  CollectionMode,
  CollectionNestingPermissions,
  CollectionPermissions,
  CollectionProperties,
  MetaUpdatePermission,
  TokenPropertiesPermissions,
} from '@unique-nft/sdk/tokens/types';
import { CollectionLimits } from '@unique-nft/sdk/tokens/methods/set-collection-limits/types';

import { DEFAULT_CONST_SCHEMA } from './constants';
import {
  CollectionFieldDto,
  CollectionSelectFieldDto,
  CollectionTextFieldDto,
} from './unique-fileds';

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
  @ApiProperty({
    description: 'Maximum number of tokens that one address can own',
    example: 1000,
  })
  @CollectionLimitItem
  accountTokenOwnershipLimit?: number | null;

  @ApiProperty({
    description:
      'Maximum byte size of custom token data that can be sponsored when tokens are minted in sponsored mode',
    example: 1024,
  })
  @CollectionLimitItem
  sponsoredDataSize?: number | null;

  @ApiProperty({
    description:
      'Defines how many blocks need to pass between setVariableMetadata transactions in order for them to be sponsored',
    example: 30,
  })
  @CollectionLimitItem
  sponsoredDataRateLimit?: number | null;

  @ApiProperty({
    description: 'Total amount of tokens that can be minted in this collection',
    example: 1000000,
  })
  @CollectionLimitItem
  tokenLimit?: number | null;

  @ApiProperty({
    description:
      'Time interval in blocks that defines once per how long a non-privileged user transfer or mint transaction can be sponsored',
    example: 6,
  })
  @CollectionLimitItem
  sponsorTransferTimeout?: number | null;

  @ApiProperty({
    description:
      'Time interval in blocks that defines once per how long a non-privileged user approve transaction can be sponsored',
    example: 6,
  })
  @CollectionLimitItem
  sponsorApproveTimeout?: number | null;

  @ApiProperty({
    description:
      'Boolean value that tells if collection owner or admins can transfer or burn tokens owned by other non-privileged users',
    example: false,
  })
  @CollectionLimitItem
  ownerCanTransfer?: boolean | null;

  @ApiProperty({
    description: 'Boolean value that tells if collection owner can destroy it',
    example: false,
  })
  @CollectionLimitItem
  ownerCanDestroy?: boolean | null;

  @ApiProperty({
    description:
      'Flag that defines whether token transfers between users are currently enabled',
    example: false,
  })
  @CollectionLimitItem
  transfersEnabled?: boolean | null;
}

export class CollectionNestingPermissionsDto
  implements CollectionNestingPermissions
{
  tokenOwner: boolean;

  collectionAdmin: boolean;
}

export class CollectionPermissionsDto implements CollectionPermissions {
  @ApiProperty({ enum: CollectionAccess, required: false })
  access?: CollectionAccess | `${CollectionAccess}`;

  @ApiProperty({ required: false })
  mintMode?: boolean;

  @ApiProperty({ required: false })
  nesting?: CollectionNestingPermissionsDto;
}

@ApiExtraModels(CollectionTextFieldDto, CollectionSelectFieldDto)
export class CollectionPropertiesDto implements CollectionProperties {
  @ApiProperty({
    required: false,
    example:
      'https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png',
  })
  offchainSchema?: string;

  @ApiProperty({ enum: CollectionSchemaVersion, required: false })
  schemaVersion?: CollectionSchemaVersion | `${CollectionSchemaVersion}`;

  @ApiProperty({
    example: '{}',
    required: false,
  })
  variableOnChainSchema?: string | null;

  @ApiProperty({
    type: Object,
    example: JSON.stringify(DEFAULT_CONST_SCHEMA),
    required: false,
  })
  constOnChainSchema?: INamespace | null;

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(CollectionTextFieldDto) },
        { $ref: getSchemaPath(CollectionSelectFieldDto) },
      ],
    },
    required: false,
    example: [
      {
        id: 1,
        type: CollectionFieldTypes.TEXT,
        name: 'name',
        required: true,
      },
      {
        id: 2,
        type: CollectionFieldTypes.SELECT,
        name: 'mode',
        required: false,
        items: ['mode A', 'mode B'],
      },
    ],
  })
  fields?: CollectionFieldDto[];
}

export class TokenPropertyPermissionsDto implements TokenPropertyPermissions {
  @ApiProperty({
    type: Boolean,
    required: false,
  })
  mutable?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  collectionAdmin?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  tokenOwner?: boolean;
}

export class TokenPropertiesPermissionsDto
  implements TokenPropertiesPermissions
{
  @ApiProperty({
    required: false,
  })
  constData?: TokenPropertyPermissionsDto;
}

export class CollectionInfoBaseDto implements CollectionInfoBase {
  @ApiProperty({ enum: CollectionMode, required: false })
  mode?: CollectionMode | `${CollectionMode}`;

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
  sponsorship?: CollectionSponsorship | null;

  @ApiProperty({ required: false })
  limits?: CollectionLimitsDto;

  @ApiProperty({ enum: MetaUpdatePermission, required: false })
  metaUpdatePermission?: MetaUpdatePermission | `${MetaUpdatePermission}`;

  @ApiProperty()
  properties: CollectionPropertiesDto;

  @ApiProperty({
    required: false,
  })
  permissions?: CollectionPermissionsDto;

  @ApiProperty({
    required: false,
  })
  tokenPropertyPermissions?: TokenPropertiesPermissionsDto;
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
}

export class TokenPropertiesResponse implements TokenProperties {
  @ApiProperty({
    example: {
      ipfsJson:
        '{"ipfs":"QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb","type":"image"}',
      gender: 'Male',
      traits: ['TEETH_SMILE', 'UP_HAIR'],
    },
  })
  constData?: AnyObject;
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
    description: 'URL of the token content on IPFS node (if available)',
    example:
      'https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png',
  })
  url: string | null;

  properties: TokenPropertiesResponse;
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
