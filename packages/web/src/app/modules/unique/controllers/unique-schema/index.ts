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
  DecodedInfixOrUrlOrCidAndHashSchemaApiProperty,
  InfixOrUrlOrCidAndHashSchemaApiProperty,
  StringOrLocalizedString,
} from './shared';

export { UniqueCollectionSchemaToCreateDto } from './collection-schema-to-create';
export { UniqueCollectionSchemaDecodedDto } from './collection-schema-decoded';

export class UniqueTokenDecodedResponse implements UniqueTokenDecoded {
  @ApiProperty()
  attributes: DecodedAttributes;

  @ApiProperty()
  collectionId: CollectionId;

  @DecodedInfixOrUrlOrCidAndHashSchemaApiProperty
  image: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty()
  owner: SubOrEthAddressObj;

  @ApiProperty()
  tokenId: TokenId;

  @DecodedInfixOrUrlOrCidAndHashSchemaApiProperty
  audio?: DecodedInfixOrUrlOrCidAndHash;

  @StringOrLocalizedString
  description?: string | LocalizedStringDictionary;

  @StringOrLocalizedString
  name?: string | LocalizedStringDictionary;

  @DecodedInfixOrUrlOrCidAndHashSchemaApiProperty
  imagePreview?: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty({
    type: 'object',
    required: false,
    properties: {
      collectionId: { type: 'number' },
      tokenId: { type: 'number' },
    },
  })
  nestingParentToken?: { collectionId: CollectionId; tokenId: TokenId };

  @DecodedInfixOrUrlOrCidAndHashSchemaApiProperty
  spatialObject?: DecodedInfixOrUrlOrCidAndHash;

  @DecodedInfixOrUrlOrCidAndHashSchemaApiProperty
  video?: DecodedInfixOrUrlOrCidAndHash;
}

class UniqueTokenDataToCreateDto implements UniqueTokenToCreate {
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

  @InfixOrUrlOrCidAndHashSchemaApiProperty
  image: InfixOrUrlOrCidAndHash;
}

export class CreateTokenNewDto implements CreateTokenNewArguments {
  @ApiProperty()
  address: Address;

  @ApiProperty()
  collectionId: number;

  @ApiProperty({ type: UniqueTokenDataToCreateDto })
  data: UniqueTokenDataToCreateDto;

  @ApiProperty()
  owner?: Address;
}