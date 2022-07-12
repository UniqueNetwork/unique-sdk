import {
  CollectionSchemaName,
  CollectionAttributesSchema,
  InfixOrUrlOrCidAndHash,
  UniqueCollectionSchemaToCreate,
} from '@unique-nft/sdk/tokens';

import { ApiProperty } from '@nestjs/swagger';
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
  schemaName: CollectionSchemaName;

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
