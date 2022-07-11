/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { SchemaObjectMetadata } from '@nestjs/swagger/dist/interfaces/schema-object-metadata.interface';
import {
  AttributeSchema,
  AttributeType,
  AttributeKind,
  LocalizedStringDictionary,
} from '@unique-nft/api';

export const infixOrUrlOrCidAndHashSchema: SchemaObjectMetadata = {
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

export const decodedInfixOrUrlOrCidAndHashSchema: SchemaObjectMetadata = {
  ...infixOrUrlOrCidAndHashSchema,
  properties: {
    fullUrl: {
      type: 'string',
      nullable: true,
    },
  },
};

export const localizedStringDictionarySchema = {
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
