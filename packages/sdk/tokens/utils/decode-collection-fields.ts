import {
  CollectionField,
  CollectionFields,
  CollectionFieldTypes,
} from '@unique-nft/sdk/types';
import { IField, IType, INamespace, AnyNestedObject } from 'protobufjs';

const decodeField = (
  name: string,
  field: IField,
  nested: { [k: string]: AnyNestedObject },
): CollectionField => {
  if (field.type === 'string') {
    return {
      type: CollectionFieldTypes.TEXT,
      name,
      required: field.rule === 'required',
    };
  }

  const items: string[] = [];

  if (name in nested) {
    const options = nested[name].options || {};

    Object.keys(options).forEach((key) => {
      items.push(options[key]);
    });
  }

  return {
    type: CollectionFieldTypes.SELECT,
    name,
    items,
    required: field.rule === 'required',
    multi: field.rule === 'repeated',
  };
};

/* eslint-disable  @typescript-eslint/dot-notation */
export const decodeCollectionFields = (
  constOnChainSchema: INamespace,
): CollectionFields => {
  const onChainMetaData: INamespace | undefined = constOnChainSchema.nested
    ? constOnChainSchema.nested['onChainMetaData']
    : undefined;

  if (!onChainMetaData) return [];
  if (!onChainMetaData.nested) return [];

  const NFTMeta = onChainMetaData.nested['NFTMeta'] as IType;
  if (!NFTMeta) return [];

  const { fields } = NFTMeta;
  if (!fields) return [];

  return Object.keys(fields).map((key) =>
    decodeField(key, fields[key], onChainMetaData.nested || {}),
  );
};
