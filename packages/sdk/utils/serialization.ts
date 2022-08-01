/* eslint-disable  @typescript-eslint/no-use-before-define */
import { Codec } from '@polkadot/types-codec/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { ApiPromise } from '@polkadot/api';
import { SubmittableDispatchError } from '@unique-nft/sdk/types';

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

export const getDispatchError = (
  api: ApiPromise,
  submittableResult: ISubmittableResult,
): SubmittableDispatchError | null => {
  const { isError, dispatchError, internalError } = submittableResult;

  if (dispatchError) {
    if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule);

      const { docs, name, section } = decoded;
      return {
        details: {
          name,
          section,
        },
        message: docs.join(' '),
      };
    }

    return {
      message: dispatchError.toString(),
    };
  }

  if (internalError) {
    return {
      message: 'Internal error',
      details: internalError,
    };
  }

  if (isError) {
    return {
      message: 'Unknown error',
    };
  }

  return null;
};
