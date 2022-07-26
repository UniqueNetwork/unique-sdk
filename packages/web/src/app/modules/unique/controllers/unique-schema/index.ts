/* eslint-disable max-classes-per-file */
import {
  UniqueTokenDecoded,
  DecodedInfixOrUrlOrCidAndHash,
  CreateTokenNewArguments,
  OwnerAddress,
  LocalizedStringWithDefault,
  BoxedNumberWithDefault,
  DecodedAttributes,
  AttributeType,
} from '@unique-nft/sdk/tokens';
import {
  ApiExtraModels,
  ApiProperty,
  getSchemaPath,
  refs,
} from '@nestjs/swagger';
import { Address } from '@unique-nft/sdk/types';
import {
  UniqueTokenToCreateDto,
  DecodedInfixOrUrlOrCidAndHashSchemaApiProperty,
  EthereumAddress,
  SubstrateAddress,
  localizedStringWithDefaultSchema,
  boxedNumberWithDefaultSchema,
} from './shared';

export { UniqueCollectionSchemaToCreateDto } from './collection-schema-to-create';
export { UniqueCollectionSchemaDecodedDto } from './collection-schema-decoded';

class NestingParentId {
  @ApiProperty()
  collectionId: number;

  @ApiProperty()
  tokenId: number;
}

class DecodedAttributeDto {
  @ApiProperty({ ...localizedStringWithDefaultSchema, required: false })
  name: LocalizedStringWithDefault;

  @ApiProperty({ enum: AttributeType })
  type: AttributeType;

  @ApiProperty()
  isArray: boolean;

  @ApiProperty({
    oneOf: [
      localizedStringWithDefaultSchema,
      boxedNumberWithDefaultSchema,
      { type: 'array', items: localizedStringWithDefaultSchema },
      { type: 'array', items: boxedNumberWithDefaultSchema },
    ],
  })
  value:
    | LocalizedStringWithDefault
    | BoxedNumberWithDefault
    | Array<LocalizedStringWithDefault>
    | Array<BoxedNumberWithDefault>;
}

@ApiExtraModels(DecodedAttributeDto, SubstrateAddress, EthereumAddress)
export class UniqueTokenDecodedResponse implements UniqueTokenDecoded {
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

  @ApiProperty({ ...localizedStringWithDefaultSchema, required: false })
  description?: LocalizedStringWithDefault;

  @ApiProperty({ ...localizedStringWithDefaultSchema, required: false })
  name?: LocalizedStringWithDefault;

  @DecodedInfixOrUrlOrCidAndHashSchemaApiProperty
  imagePreview?: DecodedInfixOrUrlOrCidAndHash;

  @ApiProperty({
    type: NestingParentId,
  })
  nestingParentToken?: NestingParentId;

  @DecodedInfixOrUrlOrCidAndHashSchemaApiProperty
  spatialObject?: DecodedInfixOrUrlOrCidAndHash;

  @DecodedInfixOrUrlOrCidAndHashSchemaApiProperty
  video?: DecodedInfixOrUrlOrCidAndHash;
}

export class CreateTokenNewDto implements CreateTokenNewArguments {
  @ApiProperty()
  address: Address;

  @ApiProperty()
  collectionId: number;

  @ApiProperty({ type: UniqueTokenToCreateDto })
  data: UniqueTokenToCreateDto;

  @ApiProperty()
  owner?: Address;
}
