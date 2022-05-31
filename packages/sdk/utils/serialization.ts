import { Codec } from '@polkadot/types-codec/types';

function serializeCodec(data: Codec): object {
  return {
    rawType: data.toRawType(),
    human: data.toHuman(),
    json: data.toJSON(),
    hex: data.toHex(),
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
