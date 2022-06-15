import {
  CollectionField,
  CollectionFields,
  CollectionFieldTypes,
} from '@unique-nft/sdk/types';
import { Root, IField, Enum, INamespace } from 'protobufjs';

const decodeField = (
  name: string,
  field: IField,
  root: Root,
): CollectionField => {
  if (field.type === 'string') {
    return {
      type: CollectionFieldTypes.TEXT,
      name,
      required: field.rule === 'required',
    };
  }

  const item: Enum = root.lookupEnum(name);

  const items: string[] = [];
  if (item && item.options) {
    items.push(...Object.values(item.options));
  }

  if (field.rule === 'repeated') {
    return {
      type: CollectionFieldTypes.SELECT,
      name,
      items,
      multi: true,
    };
  }

  return {
    type: CollectionFieldTypes.SELECT,
    name,
    items,
    required: field.rule === 'required',
  };
};

/* eslint-disable  @typescript-eslint/dot-notation */
export const decodeCollectionFields = (
  constOnChainSchema: INamespace,
): CollectionFields => {
  const root = Root.fromJSON(constOnChainSchema);

  const nftMetaType = root.lookupType('NFTMeta');
  if (!nftMetaType) return [];

  const { fields } = nftMetaType;
  if (!fields) return [];

  return Object.keys(fields).map((key) => decodeField(key, fields[key], root));
};
