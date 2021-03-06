import { INamespace } from 'protobufjs';

export const DEFAULT_CONST_SCHEMA: INamespace = {
  nested: {
    onChainMetaData: {
      nested: {
        NFTMeta: {
          fields: {
            ipfsJson: {
              id: 1,
              rule: 'required',
              type: 'string',
            },
          },
        },
      },
    },
  },
};
