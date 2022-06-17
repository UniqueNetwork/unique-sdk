// eslint-disable-next-line max-classes-per-file
import { ApiProperty } from '@nestjs/swagger';
import {
  CollectionFieldBase,
  CollectionFieldTypes,
  CollectionSelectField,
  CollectionTextField,
} from '@unique-nft/sdk/types';

export class CollectionFieldBaseDto implements CollectionFieldBase {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: CollectionFieldTypes })
  type: CollectionFieldTypes;

  @ApiProperty({
    required: false,
  })
  required?: boolean;
}

export class CollectionTextFieldDto
  extends CollectionFieldBaseDto
  implements CollectionTextField
{
  @ApiProperty({
    type: 'string',
    enum: [CollectionFieldTypes.TEXT],
  })
  readonly type = CollectionFieldTypes.TEXT;
}

export class CollectionSelectFieldDto
  extends CollectionFieldBaseDto
  implements CollectionSelectField
{
  @ApiProperty({
    type: 'string',
    enum: [CollectionFieldTypes.SELECT],
  })
  readonly type = CollectionFieldTypes.SELECT;

  @ApiProperty()
  items: string[];

  @ApiProperty({
    required: false,
  })
  multi?: boolean;
}

export type CollectionFieldDto =
  | CollectionTextFieldDto
  | CollectionSelectFieldDto;
export type CollectionFieldsDto = Array<CollectionFieldDto>;
