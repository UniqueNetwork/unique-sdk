/* eslint-disable max-classes-per-file */
import {
  TokenDecoded,
  CollectionId,
  DecodedInfixOrUrlOrCidAndHash,
  TokenId,
  DecodedAttributes,
  LocalizedStringDictionary,
  UniqueTokenToCreate,
  EncodedTokenAttributes,
  InfixOrUrlOrCidAndHash,
  CreateTokenNewArguments,
  OwnerAddress,
} from '@unique-nft/sdk/tokens';
import {
  ApiExtraModels,
  ApiProperty,
  getSchemaPath,
  refs,
} from '@nestjs/swagger';
import { Address } from '@unique-nft/sdk/types';
import {
  DecodedAttributeDto,
  DecodedInfixOrUrlOrCidAndHashSchemaApiProperty,
  EthereumAddress,
  InfixOrUrlOrCidAndHashSchemaApiProperty,
  StringOrLocalizedString,
  SubstrateAddress,
} from './shared';

export { UniqueCollectionSchemaToCreateDto } from './collection-schema-to-create';
export { UniqueCollectionSchemaDecodedDto } from './collection-schema-decoded';

@ApiExtraModels(DecodedAttributeDto, SubstrateAddress, EthereumAddress)
export class TokenDecodedResponse implements TokenDecoded {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(DecodedAttributeDto) },
  })
  attributes: DecodedAttributes;

  @ApiProperty()
  collectionId: number;

  @DecodedInfixOrUrlOrCidAndHashSchemaApiProperty
  image: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty({ oneOf: refs(SubstrateAddress, EthereumAddress) })
  owner: OwnerAddress;

  @ApiProperty()
  tokenId: number;

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
      0: 0,
      1: [1],
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
