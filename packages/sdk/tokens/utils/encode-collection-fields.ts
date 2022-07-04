import {
  CollectionField,
  CollectionFields,
  CollectionFieldTypes,
  CollectionSelectField,
} from '@unique-nft/sdk/types';
import { IEnum, IField, INamespace } from 'protobufjs';
import { ValidationError } from '@unique-nft/sdk/errors';
import { Registry } from '@polkadot/types/types';
import { UpDataStructsSponsoringRateLimit } from '@unique-nft/unique-mainnet-types/default/types';

const encodeEnum = (selectField: CollectionSelectField): IEnum => {
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

export const encodeField = (field: CollectionField): IField => {
  const { id, type, name, required } = field;

  const rule = required ? 'required' : 'optional';

  let selectField: CollectionSelectField;

  switch (type) {
    case CollectionFieldTypes.TEXT:
      return {
        id,
        rule,
        type: 'string',
      };
    case CollectionFieldTypes.SELECT:
      selectField = field as CollectionSelectField;

      if (selectField.multi) {
        if (required) {
          throw new ValidationError(
            `Multiselect field "${name}" cannot be required`,
            { field },
          );
        }

        return {
          id,
          rule: 'repeated',
          type: name,
        };
      }

      return {
        id,
        rule,
        type: name,
      };
    default:
      throw new ValidationError('Invalid collection field type', { field });
  }
};

export const encodeCollectionFields = (
  collectionFields: CollectionFields,
): INamespace => {
  const protobufEnums: Record<string, IEnum> = {};

  const protobufFields: Record<string, IField> = {};

  const idsContainer: Record<number, true> = {};

  const namesContainer: Record<string, true> = {};

  collectionFields.forEach((field) => {
    const { id, name, type } = field;

    if (idsContainer[id]) {
      throw new ValidationError(
        `The "id" property in fields list must be unique`,
        { field },
      );
    }
    idsContainer[id] = true;

    if (namesContainer[name]) {
      throw new ValidationError(
        `The "name" property in fields list must be unique`,
        { field },
      );
    }
    namesContainer[name] = true;

    protobufFields[name] = encodeField(field);

    if (type === CollectionFieldTypes.SELECT) {
      protobufEnums[name] = encodeEnum(field as CollectionSelectField);
    }
  });

  return {
    nested: {
      onChainMetaData: {
        nested: {
          NFTMeta: {
            fields: protobufFields,
          },
          ...protobufEnums,
        },
      },
    },
  };
};

export const encodeSponsoredDataRateLimit = (
  registry: Registry,
  input: number | null,
): UpDataStructsSponsoringRateLimit => {
  const asObject =
    input && input > 0
      ? { Blocks: input, isSponsoringDisabled: false }
      : { isSponsoringDisabled: true };

  const encoded = registry.createType<UpDataStructsSponsoringRateLimit>(
    'UpDataStructsSponsoringRateLimit',
    asObject,
  );

  return encoded;
};
