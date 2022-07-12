/* eslint-disable max-classes-per-file */

import { ApiProperty } from '@nestjs/swagger';
import {
  CollectionIdArguments,
  CollectionInfoWithSchema,
  CreateCollectionArguments,
  CreateCollectionNewArguments,
} from '@unique-nft/sdk/tokens';
import {
  CollectionInfoBaseDto,
  CollectionInfoResponse,
  CollectionInfoWithPropertiesDto,
} from '../../../../types/unique-types';
import { AddressApiProperty } from '../../../../types/sdk-methods';
import { MutationResponse } from '../../../../decorators/mutation-method';
import {
  UniqueCollectionSchemaDecodedDto,
  UniqueCollectionSchemaToCreateDto,
} from '../unique-schema';

export class CreateCollectionBody
  extends CollectionInfoWithPropertiesDto
  implements CreateCollectionArguments
{
  @AddressApiProperty
  address: string;
}

export class CreateCollectionParsed implements CollectionIdArguments {
  @ApiProperty()
  collectionId: number;
}

export class CreateCollectionResponse extends MutationResponse {
  @ApiProperty()
  parsed: CreateCollectionParsed;
}

export class CreateCollectionNewRequest
  extends CollectionInfoBaseDto
  implements CreateCollectionNewArguments
{
  @AddressApiProperty
  address: string;

  @ApiProperty({ type: UniqueCollectionSchemaToCreateDto })
  schema: UniqueCollectionSchemaToCreateDto;
}

export class CollectionInfoWithSchemaResponse
  extends CollectionInfoResponse
  implements CollectionInfoWithSchema
{
  @ApiProperty({ type: UniqueCollectionSchemaDecodedDto })
  schema: UniqueCollectionSchemaDecodedDto;
}
