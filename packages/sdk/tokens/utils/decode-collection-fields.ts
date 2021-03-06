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
      id: field.id,
      type: CollectionFieldTypes.TEXT,
      name,
      required: field.rule === 'required',
    };
  }

  const item: Enum = root.lookupEnum(field.type);

  const items: string[] = [];
  if (item && item.options) {
    items.push(...Object.values(item.options));
  }

  if (field.rule === 'repeated') {
    return {
      id: field.id,
      type: CollectionFieldTypes.SELECT,
      name,
      items,
      multi: true,
    };
  }

  return {
    id: field.id,
    type: CollectionFieldTypes.SELECT,
    name,
    items,
    required: field.rule === 'required',
  };
};

export const decodeCollectionFields = (
  constOnChainSchema: INamespace,
): CollectionFields => {
  try {
    const root = Root.fromJSON(constOnChainSchema);

    const nftMetaType = root.lookupType('NFTMeta');
    if (!nftMetaType) return [];

    const { fields } = nftMetaType;
    if (!fields) return [];

    return Object.keys(fields).map((key) => decodeField(key, fields[key], root));
  } catch (e) {
    console.warn(e); // todo logger?
    return [];
  }
};
