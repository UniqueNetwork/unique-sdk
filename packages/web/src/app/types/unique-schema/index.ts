/* eslint-disable max-classes-per-file */
import {
  UniqueTokenDecoded,
  CollectionId,
  DecodedInfixOrUrlOrCidAndHash,
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
import {
  decodedInfixOrUrlOrCidAndHashSchema,
  infixOrUrlOrCidAndHashSchema,
  localizedStringDictionarySchema,
} from './base-dtos';

export class UniqueTokenDecodedResponse implements UniqueTokenDecoded {
  @ApiProperty()
  attributes: DecodedAttributes;

  @ApiProperty()
  collectionId: CollectionId;

  @ApiProperty(decodedInfixOrUrlOrCidAndHashSchema)
  image: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty()
  owner: SubOrEthAddressObj;

  @ApiProperty()
  tokenId: TokenId;

  @ApiProperty(decodedInfixOrUrlOrCidAndHashSchema)
  audio?: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty({ oneOf: [{ type: 'string' }, localizedStringDictionarySchema] })
  description?: string | LocalizedStringDictionary;

  @ApiProperty(decodedInfixOrUrlOrCidAndHashSchema)
  imagePreview?: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty({ oneOf: [{ type: 'string' }, localizedStringDictionarySchema] })
  name?: string | LocalizedStringDictionary;

  @ApiProperty({
    type: 'object',
    required: false,
    properties: {
      collectionId: { type: 'number' },
      tokenId: { type: 'number' },
    },
  })
  nestingParentToken?: { collectionId: CollectionId; tokenId: TokenId };

  @ApiProperty(decodedInfixOrUrlOrCidAndHashSchema)
  spatialObject?: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty(decodedInfixOrUrlOrCidAndHashSchema)
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
