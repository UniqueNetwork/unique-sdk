/* eslint-disable max-classes-per-file */
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import {
  AttributeKind,
  AttributeType,
  COLLECTION_SCHEMA_NAME,
  UrlTemplateString,
} from '@unique-nft/api';
import {
  AttributeSchemaDto,
  decodedInfixOrUrlOrCidAndHashSchema,
  infixOrUrlOrCidAndHashSchema,
} from './base-dtos';

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

export const InfixOrUrlOrCidAndHashSchemaApiProperty = ApiProperty(
  infixOrUrlOrCidAndHashSchema,
);

export const DecodedInfixOrUrlOrCidAndHashSchemaApiProperty = ApiProperty(
  decodedInfixOrUrlOrCidAndHashSchema,
);

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