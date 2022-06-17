// eslint-disable-next-line max-classes-per-file
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsPositive,
  IsInt,
  IsEnum,
  IsBoolean,
  IsIn,
} from 'class-validator';
import {
  CollectionFieldBase,
  CollectionFieldTypes,
  CollectionSelectField,
  CollectionTextField,
} from '@unique-nft/sdk/types';

export class CollectionFieldBaseDto implements CollectionFieldBase {
  @IsInt()
  @IsPositive()
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty()
  name: string;

  @IsEnum(CollectionFieldTypes)
  @ApiProperty({ enum: CollectionFieldTypes })
  type: CollectionFieldTypes;

  @IsBoolean()
  @ApiProperty({
    required: false,
  })
  required?: boolean;
}

export class CollectionTextFieldDto
  extends CollectionFieldBaseDto
  implements CollectionTextField
{
  @IsIn([CollectionFieldTypes.TEXT])
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
  @IsIn([CollectionFieldTypes.SELECT])
  @ApiProperty({
    type: 'string',
    enum: [CollectionFieldTypes.SELECT],
  })
  readonly type = CollectionFieldTypes.SELECT;

  @IsString({ each: true })
  @ApiProperty()
  items: string[];

  @IsBoolean()
  @ApiProperty({
    required: false,
  })
  multi?: boolean;
}

export type CollectionFieldDto =
  | CollectionTextFieldDto
  | CollectionSelectFieldDto;
