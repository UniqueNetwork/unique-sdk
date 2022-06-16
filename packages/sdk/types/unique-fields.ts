export enum CollectionFieldTypes {
  TEXT = 'text',
  SELECT = 'select',
}

export interface CollectionFieldBase {
  name: string;
  type: CollectionFieldTypes;
  required?: boolean;
}

export interface CollectionTextField extends CollectionFieldBase {
  type: CollectionFieldTypes.TEXT;
}

export interface CollectionSelectField extends CollectionFieldBase {
  type: CollectionFieldTypes.SELECT;
  items: string[];
  multi?: boolean;
}

export type CollectionField = CollectionTextField | CollectionSelectField;

export type CollectionFields = Array<CollectionField>;
