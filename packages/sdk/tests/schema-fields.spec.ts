import { encodeCollectionFields } from '@unique-nft/sdk/tokens/utils/encode-collection-fields';
import { CollectionFields, CollectionFieldTypes } from '@unique-nft/sdk/types';
import { INamespace } from 'protobufjs';

const fields: CollectionFields = [
  {
    name: 'text_required',
    type: CollectionFieldTypes.TEXT,
    required: true,
  },
  {
    name: 'text_optional',
    type: CollectionFieldTypes.TEXT,
    required: false,
  },
  {
    name: 'select_required',
    type: CollectionFieldTypes.SELECT,
    required: true,
    items: ['select required 1', 'select required 2'],
  },
  {
    name: 'select_optional',
    type: CollectionFieldTypes.SELECT,
    required: false,
    items: ['select optional 1', 'select optional 2'],
  },
  {
    name: 'mselect',
    type: CollectionFieldTypes.SELECT,
    multiSelect: true,
    items: ['multi-select 1', 'multi-select 2'],
  },
];

export const constOnChainSchema: INamespace = {
  nested: {
    onChainMetaData: {
      nested: {
        NFTMeta: {
          fields: {
            text_required: {
              id: 1,
              rule: 'required',
              type: 'string',
            },
            text_optional: {
              id: 2,
              rule: 'optional',
              type: 'string',
            },
            select_required: {
              id: 3,
              rule: 'required',
              type: 'select_required',
            },
            select_optional: {
              id: 4,
              rule: 'optional',
              type: 'select_optional',
            },
            mselect: {
              id: 5,
              rule: 'repeated',
              type: 'mselect',
            },
          },
        },
        select_required: {
          options: {
            field1: '{"en":"select required 1"}',
            field2: '{"en":"select required 2"}',
          },
          values: {
            field1: 0,
            field2: 1,
          },
        },
        select_optional: {
          options: {
            field1: '{"en":"select optional 1"}',
            field2: '{"en":"select optional 2"}',
          },
          values: {
            field1: 0,
            field2: 1,
          },
        },
        mselect: {
          options: {
            field1: '{"en":"multi-select 1"}',
            field2: '{"en":"multi-select 2"}',
          },
          values: {
            field1: 0,
            field2: 1,
          },
        },
      },
    },
  },
};

describe('Collections fields', () => {
  it('encode', () => {
    const encoded = encodeCollectionFields(fields);
    expect(encoded).toMatchObject(constOnChainSchema);
  });
});
