/* eslint-disable max-classes-per-file */
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { SchemaObjectMetadata } from '@nestjs/swagger/dist/interfaces/schema-object-metadata.interface';

class Url {
  @ApiProperty()
  url: string;

  @ApiProperty()
  hash?: string;
}

class UrlInfix {
  @ApiProperty()
  urlInfix: string;

  @ApiProperty()
  hash?: string;
}

class IpfsCid {
  @ApiProperty()
  ipfsCid: string;

  @ApiProperty()
  hash?: string;
}

export const infixOrUrlOrCidAndHashSchema: SchemaObjectMetadata = {
  oneOf: [
    { $ref: getSchemaPath(Url) },
    { $ref: getSchemaPath(UrlInfix) },
    { $ref: getSchemaPath(IpfsCid) },
  ],
};
