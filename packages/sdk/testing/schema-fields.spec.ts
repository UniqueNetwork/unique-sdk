import { encodeCollectionFields } from '@unique-nft/sdk/tokens/utils/encode-collection-fields';
import { CollectionFields, CollectionFieldTypes } from '@unique-nft/sdk/types';
import { INamespace } from 'protobufjs';
import { decodeCollectionFields } from '@unique-nft/sdk/tokens/utils/decode-collection-fields';
import { ValidationError } from '@unique-nft/sdk/errors';
import { validateOnChainSchema } from '@unique-nft/sdk/tokens/utils/validator';

const fields: CollectionFields = [
  {
    id: 1,
    name: 'text_required',
    type: CollectionFieldTypes.TEXT,
    required: true,
  },
  {
    id: 2,
    name: 'text_optional',
    type: CollectionFieldTypes.TEXT,
  },
  {
    id: 3,
    name: 'select_required',
    type: CollectionFieldTypes.SELECT,
    required: true,
    items: ['{"en":"select required 1"}', '{"en":"select required 2"}'],
  },
  {
    id: 4,
    name: 'select_optional',
    type: CollectionFieldTypes.SELECT,
    items: ['{"en":"select optional 1"}', '{"en":"select optional 2"}'],
  },
  {
    id: 5,
    name: 'mselect',
    type: CollectionFieldTypes.SELECT,
    multi: true,
    items: ['{"en":"multi-select 1"}', '{"en":"multi-select 2"}'],
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

describe('Collections fields & schema', () => {
  describe('fields', () => {
    it('encode', () => {
      const encoded = encodeCollectionFields(fields);
      expect(encoded).toMatchObject(constOnChainSchema);
    });

    it('decode', () => {
      const decoded = decodeCollectionFields(constOnChainSchema);
      expect(decoded).toMatchObject(fields);
    });

    it('validation, unique id', () => {
      expect(() => {
        encodeCollectionFields([
          {
            id: 1,
            name: 'a',
            type: CollectionFieldTypes.TEXT,
          },
          {
            id: 1,
            name: 'b',
            type: CollectionFieldTypes.TEXT,
          },
        ]);
      }).toThrow(
        new ValidationError('The "id" property in fields list must be unique'),
      );
    });

    it('validation, unique name', () => {
      expect(() => {
        encodeCollectionFields([
          {
            id: 1,
            name: 'a',
            type: CollectionFieldTypes.TEXT,
          },
          {
            id: 2,
            name: 'a',
            type: CollectionFieldTypes.TEXT,
          },
        ]);
      }).toThrow(
        new ValidationError(
          'The "name" property in fields list must be unique',
        ),
      );
    });
  });

  describe('schema', () => {
    it('validation, no such type NFTMeta', () => {
      expect(() => {
        validateOnChainSchema({
          nested: {
            onChainMetaData: {},
          },
        });
      }).toThrow(new ValidationError('no such type: NFTMeta'));
    });

    it('validation, invalid rule', () => {
      expect(() => {
        validateOnChainSchema({
          nested: {
            onChainMetaData: {
              nested: {
                NFTMeta: {
                  fields: {
                    fieldA: {
                      id: 1,
                      type: 'string',
                      rule: 'invalid_rule',
                    },
                  },
                },
              },
            },
          },
        });
      }).toThrow(new ValidationError(`rule must be a string rule`));
    });

    it('validation, invalid string rule', () => {
      expect(() => {
        validateOnChainSchema({
          nested: {
            onChainMetaData: {
              nested: {
                NFTMeta: {
                  fields: {
                    fieldA: {
                      id: 1,
                      type: 'string',
                      rule: 'repeated',
                    },
                  },
                },
              },
            },
          },
        });
      }).toThrow(new ValidationError(`Invalid rule in string field`));
    });

    it('validation, no such Enum in Root', () => {
      expect(() => {
        validateOnChainSchema({
          nested: {
            onChainMetaData: {
              nested: {
                NFTMeta: {
                  fields: {
                    fieldA: {
                      id: 1,
                      type: 'select',
                      rule: 'required',
                    },
                  },
                },
              },
            },
          },
        });
      }).toThrow(new ValidationError(`no such Enum 'fieldA' in Root`));
    });
  });
});
