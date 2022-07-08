/* eslint-disable max-classes-per-file */
import {
  CollectionAttributesSchema,
  UniqueTokenDecoded,
  COLLECTION_SCHEMA_NAME,
  CollectionId,
  DecodedInfixOrUrlOrCidAndHash,
  UniqueCollectionSchemaDecoded,
  UrlTemplateString,
  TokenId,
  SubOrEthAddressObj,
  DecodedAttributes,
  LocalizedStringDictionary,
} from '@unique-nft/api';
import { ApiProperty } from '@nestjs/swagger';

export class UniqueCollectionSchemaDecodedDto
  implements UniqueCollectionSchemaDecoded
{
  @ApiProperty()
  attributesSchema: CollectionAttributesSchema;

  @ApiProperty()
  attributesSchemaVersion: string;

  @ApiProperty()
  collectionId: CollectionId;

  @ApiProperty()
  coverPicture: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty()
  image: { urlTemplate: UrlTemplateString };

  @ApiProperty()
  schemaName: COLLECTION_SCHEMA_NAME;

  @ApiProperty()
  schemaVersion: string;

  @ApiProperty()
  audio?: {
    urlTemplate?: UrlTemplateString;
    format: string;
    isLossless?: boolean;
  };

  @ApiProperty()
  coverPicturePreview?: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty()
  imagePreview?: { urlTemplate?: UrlTemplateString };

  @ApiProperty()
  oldProperties?: {
    _old_schemaVersion?: string;
    _old_offchainSchema?: string;
    _old_constOnChainSchema?: string;
    _old_variableOnChainSchema?: string;
  };

  @ApiProperty()
  spatialObject?: { urlTemplate?: UrlTemplateString; format: string };

  @ApiProperty()
  video?: { urlTemplate?: UrlTemplateString };
}

export class UniqueTokenDecodedResponse implements UniqueTokenDecoded {
  @ApiProperty()
  attributes: DecodedAttributes;

  @ApiProperty()
  collectionId: CollectionId;

  @ApiProperty()
  image: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty()
  owner: SubOrEthAddressObj;

  @ApiProperty()
  tokenId: TokenId;

  @ApiProperty()
  audio?: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty()
  description?: string | LocalizedStringDictionary;

  @ApiProperty()
  imagePreview?: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty()
  name?: string | LocalizedStringDictionary;

  @ApiProperty()
  nestingParentToken?: { collectionId: CollectionId; tokenId: TokenId };

  @ApiProperty()
  spatialObject?: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty()
  video?: DecodedInfixOrUrlOrCidAndHash;
}
