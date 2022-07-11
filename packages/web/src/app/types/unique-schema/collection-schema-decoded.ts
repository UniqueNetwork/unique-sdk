import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  COLLECTION_SCHEMA_NAME,
  CollectionAttributesSchema,
  CollectionId,
  DecodedInfixOrUrlOrCidAndHash,
  UniqueCollectionSchemaDecoded,
} from '@unique-nft/api';
import { AttributeSchemaDto, OldPropertiesDto } from './base-dtos';
import {
  AttributesSchemaApiProperty,
  AttributesSchemaVersionApiProperty,
  AudioDto,
  DecodedInfixOrUrlOrCidAndHashSchemaApiProperty,
  ImageDto,
  ImagePreviewDto,
  SchemaNameApiProperty,
  SchemaVersionApiProperty,
  SpatialObjectDto,
  VideoDto,
} from './shared';

@ApiExtraModels(AttributeSchemaDto)
export class UniqueCollectionSchemaDecodedDto
  implements UniqueCollectionSchemaDecoded
{
  @AttributesSchemaApiProperty
  attributesSchema: CollectionAttributesSchema;

  @AttributesSchemaVersionApiProperty
  attributesSchemaVersion: string;

  @ApiProperty()
  collectionId: CollectionId;

  @DecodedInfixOrUrlOrCidAndHashSchemaApiProperty
  coverPicture: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty({ type: ImageDto })
  image: ImageDto;

  @SchemaNameApiProperty
  schemaName: COLLECTION_SCHEMA_NAME;

  @SchemaVersionApiProperty
  schemaVersion: string;

  @ApiProperty({ type: OldPropertiesDto })
  oldProperties?: OldPropertiesDto;

  @DecodedInfixOrUrlOrCidAndHashSchemaApiProperty
  coverPicturePreview?: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty({ type: ImagePreviewDto })
  imagePreview?: ImagePreviewDto;

  @ApiProperty({ type: AudioDto })
  audio?: AudioDto;

  @ApiProperty({ type: SpatialObjectDto })
  spatialObject?: SpatialObjectDto;

  @ApiProperty({ type: VideoDto })
  video?: VideoDto;
}
