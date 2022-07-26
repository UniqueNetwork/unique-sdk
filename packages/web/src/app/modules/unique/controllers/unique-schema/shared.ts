/* eslint-disable max-classes-per-file */
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { SchemaObjectMetadata } from '@nestjs/swagger/dist/interfaces/schema-object-metadata.interface';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
  AttributeSchema,
  AttributeType,
  LocalizedStringWithDefault,
  BoxedNumberWithDefault,
  COLLECTION_SCHEMA_NAME,
  UrlTemplateString,
  UniqueTokenToCreate,
  InfixOrUrlOrCidAndHash,
  EncodedTokenAttributes,
} from '@unique-nft/sdk/tokens';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

const infixOrUrlOrCidAndHashSchema: SchemaObjectMetadata = {
  oneOf: [
    {
      type: 'object',
      properties: {
        urlInfix: { type: 'string' },
        hash: { type: 'string', nullable: true },
      },
    },
    {
      type: 'object',
      properties: {
        url: { type: 'string' },
        hash: { type: 'string', nullable: true },
      },
    },
    {
      type: 'object',
      properties: {
        ipfsCid: { type: 'string' },
        hash: { type: 'string', nullable: true },
      },
    },
  ],
};

const decodedInfixOrUrlOrCidAndHashSchema: SchemaObjectMetadata = {
  ...infixOrUrlOrCidAndHashSchema,
  properties: {
    fullUrl: {
      type: 'string',
      nullable: true,
    },
  },
};

export const InfixOrUrlOrCidAndHashSchemaApiProperty = ApiProperty(
  infixOrUrlOrCidAndHashSchema,
);

export const DecodedInfixOrUrlOrCidAndHashSchemaApiProperty = ApiProperty(
  decodedInfixOrUrlOrCidAndHashSchema,
);

export const localizedStringWithDefaultSchema: SchemaObject = {
  type: 'object',
  properties: {
    _: { type: 'string' },
  },
  additionalProperties: { type: 'string' },
  example: {
    _: 'Hello!',
    en: 'Hello!',
    fr: 'Bonjour!',
  },
};

export const boxedNumberWithDefaultSchema: SchemaObject = {
  type: 'object',
  properties: {
    _: { type: 'number' },
  },
  example: { _: 1 },
};

export const SchemaNameApiProperty = ApiProperty({
  example: COLLECTION_SCHEMA_NAME.unique,
  enum: COLLECTION_SCHEMA_NAME,
});

export const SchemaVersionApiProperty = ApiProperty({
  example: '1.0.0',
  type: 'string',
});

export const AttributesSchemaVersionApiProperty = SchemaVersionApiProperty;

export class AttributeSchemaDto implements AttributeSchema {
  @ApiProperty({ ...localizedStringWithDefaultSchema, required: true })
  name: LocalizedStringWithDefault;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  optional?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isArray?: boolean;

  @IsEnum(AttributeType)
  @ApiProperty({ enum: AttributeType })
  type: AttributeType;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      oneOf: [localizedStringWithDefaultSchema, boxedNumberWithDefaultSchema],
    },
  })
  enumValues?: {
    [K: number]: LocalizedStringWithDefault | BoxedNumberWithDefault;
  };
}

export class UniqueTokenToCreateDto implements UniqueTokenToCreate {
  @InfixOrUrlOrCidAndHashSchemaApiProperty
  image: InfixOrUrlOrCidAndHash;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      oneOf: [
        { type: 'number' },
        { type: 'array', items: { type: 'number' } },
        localizedStringWithDefaultSchema,
        { type: 'array', items: localizedStringWithDefaultSchema },
        boxedNumberWithDefaultSchema,
        { type: 'array', items: boxedNumberWithDefaultSchema },
      ],
    },
    example: {
      0: 0,
      1: [0, 1],
    },
  })
  encodedAttributes: EncodedTokenAttributes;

  @ApiProperty({ type: String, example: 'Token name', required: false })
  name?: LocalizedStringWithDefault;

  @InfixOrUrlOrCidAndHashSchemaApiProperty
  audio?: InfixOrUrlOrCidAndHash;

  @ApiProperty({ type: String, example: 'Token description', required: false })
  description?: LocalizedStringWithDefault;

  @InfixOrUrlOrCidAndHashSchemaApiProperty
  imagePreview?: InfixOrUrlOrCidAndHash;

  @InfixOrUrlOrCidAndHashSchemaApiProperty
  spatialObject?: InfixOrUrlOrCidAndHash;

  @InfixOrUrlOrCidAndHashSchemaApiProperty
  video?: InfixOrUrlOrCidAndHash;
}

export class OldPropertiesDto {
  @ApiProperty()
  _old_schemaVersion?: string;

  @ApiProperty()
  _old_offchainSchema?: string;

  @ApiProperty()
  _old_constOnChainSchema?: string;

  @ApiProperty()
  _old_variableOnChainSchema?: string;
}

export const AttributesSchemaApiProperty = ApiProperty({
  type: 'object',
  additionalProperties: { $ref: getSchemaPath(AttributeSchemaDto) },
  example: {
    0: {
      name: { _: 'gender' },
      type: 'string',
      enumValues: {
        0: { _: 'Male' },
        1: { _: 'Female' },
      },
    },
    1: {
      name: { _: 'traits' },
      type: 'string',
      isArray: true,
      enumValues: {
        0: { _: 'Black Lipstick' },
        1: { _: 'Red Lipstick' },
      },
    },
  },
});

export class ImageDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'https://ipfs.unique.network/ipfs/{infix}.ext',
  })
  urlTemplate: UrlTemplateString;
}

export class ImagePreviewDto {
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'https://ipfs.unique.network/ipfs/{infix}.ext',
  })
  urlTemplate?: UrlTemplateString;
}

export class VideoDto extends ImagePreviewDto {}

export class SpatialObjectDto extends ImagePreviewDto {
  @ApiProperty()
  format: string;
}

export class AudioDto extends SpatialObjectDto {
  @ApiProperty()
  isLossless?: boolean;
}

export class SubstrateAddress {
  @ApiProperty()
  Substrate: string;
}

export class EthereumAddress {
  @ApiProperty()
  Ethereum: string;
}
