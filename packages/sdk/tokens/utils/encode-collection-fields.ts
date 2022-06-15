import {
  CollectionFields,
  CollectionFieldTypes,
  CollectionSelectField,
} from '@unique-nft/sdk/types';
import { INamespace, IField, IEnum } from 'protobufjs';

const encodeSelectField = (selectField: CollectionSelectField): IEnum => {
  const options: Record<string, string> = {};

  const values: Record<string, number> = {};

  selectField.items.forEach((item, index) => {
    const name = `field${index + 1}`;

    options[name] = item;

    values[name] = index;
  });

  return {
    options,
    values,
  };
};

export const encodeCollectionFields = (
  collectionFields: CollectionFields,
): INamespace => {
  const protobufTypes: Record<string, object> = {};

  const protobufFields: Record<string, IField> = {};

  collectionFields.forEach((field, index) => {
    const { type, name, required } = field;

    const id = index + 1;

    let selectField: CollectionSelectField;

    switch (type) {
      case CollectionFieldTypes.TEXT:
        protobufFields[name] = {
          id,
          rule: required ? 'required' : 'optional',
          type: 'string',
        };
        break;
      case CollectionFieldTypes.SELECT:
        selectField = field as CollectionSelectField;

        if (selectField.multi) {
          protobufFields[name] = {
            id,
            rule: 'repeated',
            type: name,
          };
        } else {
          protobufFields[name] = {
            id,
            rule: required ? 'required' : 'optional',
            type: name,
          };
        }

        protobufTypes[name] = encodeSelectField(selectField);
        break;
      default:
        throw new Error('Invalid collection field type');
    }
  });

  return {
    nested: {
      onChainMetaData: {
        nested: {
          NFTMeta: {
            fields: protobufFields,
          },
          ...protobufTypes,
        },
      },
    },
  };
};
