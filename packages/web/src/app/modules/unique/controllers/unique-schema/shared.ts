/* eslint-disable max-classes-per-file */
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { SchemaObjectMetadata } from '@nestjs/swagger/dist/interfaces/schema-object-metadata.interface';
import {
  AttributeKind,
  AttributeSchema,
  AttributeType,
  COLLECTION_SCHEMA_NAME,
  LocalizedStringDictionary,
  UrlTemplateString,
} from '@unique-nft/api';

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

const localizedStringDictionarySchema = {
  type: 'object',
  additionalProperties: { type: 'string' },
  example: {
    en: 'Hello!',
    fr: 'Bonjour!',
  },
};

export class AttributeSchemaDto implements AttributeSchema {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      oneOf: [
        { type: 'string' },
        { type: 'number' },
        localizedStringDictionarySchema,
      ],
    },
  })
  enumValues: { [p: number]: number | string | LocalizedStringDictionary };

  @ApiProperty({
    oneOf: [{ type: 'string' }, localizedStringDictionarySchema],
  })
  name: string | LocalizedStringDictionary;

  @ApiProperty()
  optional?: boolean;

  @ApiProperty({ enum: AttributeKind })
  kind: AttributeKind;

  @ApiProperty({ enum: AttributeType })
  type: AttributeType;
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
    '0': {
      name: { en: 'gender' },
      type: AttributeType.localizedStringDictionary,
      kind: AttributeKind.enum,
      enumValues: {
        0: { en: 'Male' },
        1: { en: 'Female' },
      },
    },
    '1': {
      name: { en: 'traits' },
      type: AttributeType.localizedStringDictionary,
      kind: AttributeKind.enumMultiple,
      enumValues: {
        0: { en: 'Black Lipstick' },
        1: { en: 'Red Lipstick' },
      },
    },
  },
});

export const SchemaNameApiProperty = ApiProperty({
  example: COLLECTION_SCHEMA_NAME.unique,
  enum: COLLECTION_SCHEMA_NAME,
});

export const SchemaVersionApiProperty = ApiProperty({
  example: '1.0.0',
  type: 'string',
});

export const AttributesSchemaVersionApiProperty = SchemaVersionApiProperty;

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

export const StringOrLocalizedString = ApiProperty({
  oneOf: [{ type: 'string' }, localizedStringDictionarySchema],
});
