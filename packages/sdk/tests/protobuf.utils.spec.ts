import { INamespace } from 'protobufjs';
import { serializeConstData, decodeConstData } from '../utils/protobuf.utils';

const constOnChainSchema: INamespace = {
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

const decodedExpected = {
  ipfsJson:
    '{"ipfs":"QmTdiuCLVhNj8fC8jxdFesAVjoQdDd82mbsD5hjpsNFMZd","type":"image"}',
};

const encodedExpected = Uint8Array.from([
  10, 72, 123, 34, 105, 112, 102, 115, 34, 58, 34, 81, 109, 84, 100, 105, 117,
  67, 76, 86, 104, 78, 106, 56, 102, 67, 56, 106, 120, 100, 70, 101, 115, 65,
  86, 106, 111, 81, 100, 68, 100, 56, 50, 109, 98, 115, 68, 53, 104, 106, 112,
  115, 78, 70, 77, 90, 100, 34, 44, 34, 116, 121, 112, 101, 34, 58, 34, 105,
  109, 97, 103, 101, 34, 125,
]);

describe('protobuf.utils', () => {
  it('encode', () => {
    const encoded = serializeConstData(decodedExpected, constOnChainSchema);

    expect(encoded).toEqual(encodedExpected);
  });

  it('decode', () => {
    const decoded = decodeConstData(encodedExpected, constOnChainSchema);

    expect(decoded).toEqual(decodedExpected);
  });
});
