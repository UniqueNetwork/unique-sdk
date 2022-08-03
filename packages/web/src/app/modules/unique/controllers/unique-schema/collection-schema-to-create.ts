import {
  COLLECTION_SCHEMA_NAME,
  UniqueCollectionSchemaToCreate,
  CollectionAttributesSchema,
  InfixOrUrlOrCidAndHash,
} from '@unique-nft/sdk/tokens';

import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';
import {
  AttributesSchemaApiProperty,
  AttributesSchemaVersionApiProperty,
  AudioDto,
  ImageDto,
  ImagePreviewDto,
  InfixOrUrlOrCidAndHashSchemaApiProperty,
  SchemaNameApiProperty,
  SchemaVersionApiProperty,
  SpatialObjectDto,
  VideoDto,
} from './shared';

export class UniqueCollectionSchemaToCreateDto
  implements UniqueCollectionSchemaToCreate
{
  @AttributesSchemaApiProperty
  attributesSchema: CollectionAttributesSchema;

  @AttributesSchemaVersionApiProperty
  attributesSchemaVersion: string;

  @InfixOrUrlOrCidAndHashSchemaApiProperty
  coverPicture: InfixOrUrlOrCidAndHash;

  @ApiProperty({ type: ImageDto })
  image: ImageDto;

  @SchemaNameApiProperty
  @Equals(COLLECTION_SCHEMA_NAME.unique)
  schemaName: COLLECTION_SCHEMA_NAME.unique;

  @SchemaVersionApiProperty
  schemaVersion: string;

  @InfixOrUrlOrCidAndHashSchemaApiProperty
  coverPicturePreview: InfixOrUrlOrCidAndHash;

  @ApiProperty({ type: ImagePreviewDto })
  imagePreview?: ImagePreviewDto;

  @ApiProperty({ type: AudioDto })
  audio?: AudioDto;

  @ApiProperty({ type: SpatialObjectDto })
  spatialObject?: SpatialObjectDto;

  @ApiProperty({ type: VideoDto })
  video?: VideoDto;
}
