import { INamespace } from 'protobufjs';
import { serializeConstData, decodeConstData } from '@unique-nft/sdk/utils';

type Sample = {
  ipfsJson: string;
  direction: 'Left' | 'Right';
};

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
            direction: {
              id: 2,
              rule: 'required',
              type: 'Direction',
            },
          },
        },
        Direction: {
          options: {
            Left: '{"en": "Left"}',
            Right: '{"en": "Right"}',
          },
          values: {
            Left: 1,
            Right: 2,
          },
        },
      },
    },
  },
};

const decodedLeftOriginal: Sample = {
  ipfsJson:
    '{"ipfs":"QmTdiuCLVhNj8fC8jxdFesAVjoQdDd82mbsD5hjpsNFMZd","type":"image"}',
  direction: 'Left',
};

const decodedRightOriginal: Sample = {
  ...decodedLeftOriginal,
  direction: 'Right',
};

const arrayOriginal = [
  10, 72, 123, 34, 105, 112, 102, 115, 34, 58, 34, 81, 109, 84, 100, 105, 117,
  67, 76, 86, 104, 78, 106, 56, 102, 67, 56, 106, 120, 100, 70, 101, 115, 65,
  86, 106, 111, 81, 100, 68, 100, 56, 50, 109, 98, 115, 68, 53, 104, 106, 112,
  115, 78, 70, 77, 90, 100, 34, 44, 34, 116, 121, 112, 101, 34, 58, 34, 105,
  109, 97, 103, 101, 34, 125, 16,
];

const encodedRightOriginal = Uint8Array.from([...arrayOriginal, 2]);
const encodedLeftOriginal = Uint8Array.from([...arrayOriginal, 1]);

describe('protobuf.utils', () => {
  it('encode - ok', () => {
    const encodedRight = serializeConstData(
      decodedRightOriginal,
      constOnChainSchema,
    );

    const encodedLeft = serializeConstData(
      decodedLeftOriginal,
      constOnChainSchema,
    );
    expect(encodedLeft).not.toEqual(encodedRight);
    expect(encodedRight).toEqual(encodedRightOriginal);
    expect(encodedLeft).toEqual(encodedLeftOriginal);
  });

  it('encode - validation', () => {
    const encode = (obj: any) => () =>
      serializeConstData(obj, constOnChainSchema);

    expect(encode(decodedLeftOriginal)).not.toThrowError();

    expect(encode({ ...decodedLeftOriginal, direction: 'foo' })).toThrowError();

    expect(
      encode({ ...decodedLeftOriginal, direction: undefined }),
    ).toThrowError();
  });

  it('decode', () => {
    const decodedRight = decodeConstData(
      encodedRightOriginal,
      constOnChainSchema,
    );

    const decodedLeft = decodeConstData(
      encodedLeftOriginal,
      constOnChainSchema,
    );

    expect(decodedRight).toEqual(decodedRightOriginal);
    expect(decodedLeft).toEqual(decodedLeftOriginal);
  });
});
