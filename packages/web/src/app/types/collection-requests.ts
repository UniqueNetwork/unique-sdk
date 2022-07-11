import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CollectionProperties } from '@unique-nft/sdk/tokens';
import { CreateCollectionNewArguments } from '@unique-nft/sdk/tokens/methods/create-collection-ex-new/types';
import { CreateCollectionBody } from './sdk-methods';
import { UniqueCollectionSchemaDecodedDto } from './unique-schema';

export class CreateCollectionNewRequest
  extends CreateCollectionBody
  implements CreateCollectionNewArguments
{
  @Exclude()
  properties: CollectionProperties;

  @ApiProperty()
  schema: UniqueCollectionSchemaDecodedDto;
}
