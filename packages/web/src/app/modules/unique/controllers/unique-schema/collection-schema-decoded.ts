import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  DecodedInfixOrUrlOrCidAndHash,
  UniqueCollectionSchemaDecoded,
  COLLECTION_SCHEMA_NAME,
} from '@unique-nft/sdk/tokens';
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
  AttributeSchemaDto,
  OldPropertiesDto,
} from './shared';

@ApiExtraModels(AttributeSchemaDto)
export class UniqueCollectionSchemaDecodedDto
  implements UniqueCollectionSchemaDecoded
{
  @AttributesSchemaApiProperty
  attributesSchema: Record<number, AttributeSchemaDto>;

  @AttributesSchemaVersionApiProperty
  attributesSchemaVersion: string;

  @ApiProperty()
  collectionId: number;

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
