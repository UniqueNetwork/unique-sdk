/* eslint-disable  @typescript-eslint/no-use-before-define */
import { Codec } from '@polkadot/types-codec/types';

function serializeCodec(data: Codec): object {
  return {
    rawType: data.toRawType(),
    isEmpty: data.isEmpty,
    hash: data.hash?.toHex(),
    human: data.toHuman ? data.toHuman() : undefined,
    json: data.toJSON ? data.toJSON() : undefined,
    hex: data.toHex ? data.toHex() : undefined,
  };
}

function serializeObject(data: any): any {
  if ('toRawType' in data) {
    return serializeCodec(data as Codec);
  }

  if (Array.isArray(data)) {
    return data.map((value) => serialize(value));
  }

  return Object.keys(data).reduce(
    (serializedData: any, key: string): object => {
      // eslint-disable-next-line  no-param-reassign
      serializedData[key] = serialize(data[key]);
      return serializedData;
    },
    {},
  );
}

export function serialize(data: any): any {
  if (data == null) return null;

  switch (typeof data) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
      return data;
    case 'bigint':
      return data.toString();
    case 'object':
      return serializeObject(data);
    default:
      return undefined;
  }
}
