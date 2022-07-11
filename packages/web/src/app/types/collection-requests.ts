import { ApiProperty } from '@nestjs/swagger';
import { CreateCollectionNewBody } from './sdk-methods';
import { UniqueCollectionSchemaToCreateDto } from './unique-schema/collection-schema-to-create';

export class CreateCollectionNewRequest
  extends CreateCollectionNewBody
  implements CreateCollectionNewBody
{
  @ApiProperty({ type: UniqueCollectionSchemaToCreateDto })
  schema: UniqueCollectionSchemaToCreateDto;
}
