export enum CollectionFieldTypes {
  TEXT = 'text',
  SELECT = 'select',
}

export interface CollectionFieldBase {
  name: string;
  type: CollectionFieldTypes;
  required?: boolean;
}

export interface CollectionStringField extends CollectionFieldBase {
  type: CollectionFieldTypes.TEXT;
}

export interface CollectionSelectField extends CollectionFieldBase {
  type: CollectionFieldTypes.SELECT;
  items: string[];
  multiSelect?: boolean;
}

export type CollectionFields = (
  | CollectionStringField
  | CollectionSelectField
)[];
