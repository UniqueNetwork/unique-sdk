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
  UniqueTokenToCreate,
  EncodedTokenAttributes,
  InfixOrUrlOrCidAndHash,
} from '@unique-nft/api';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTokenNewArguments } from '@unique-nft/sdk/tokens/methods/create-token';
import { Address } from '@unique-nft/sdk/types';
import { infixOrUrlOrCidAndHashSchema } from './base-dtos';

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

class UniqueTokenToCreateDto implements UniqueTokenToCreate {
  @ApiProperty({
    type: 'object',
    example: {
      0: 'sample',
      1: 1,
      2: [1, 2, 3],
      3: { en: 'sample' },
    },
  })
  encodedAttributes: EncodedTokenAttributes;

  @ApiProperty(infixOrUrlOrCidAndHashSchema)
  image: InfixOrUrlOrCidAndHash;
}

export class CreateTokenNewDto implements CreateTokenNewArguments {
  @ApiProperty()
  address: Address;

  @ApiProperty()
  collectionId: number;

  @ApiProperty()
  data: UniqueTokenToCreateDto;

  @ApiProperty()
  owner?: Address;
}
