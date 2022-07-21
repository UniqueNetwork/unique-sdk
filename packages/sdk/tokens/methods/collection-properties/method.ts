import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { bytesToString } from '@unique-nft/sdk/utils';
import {
  CollectionPropertiesArguments,
  CollectionPropertiesResult,
} from './types';

async function query(
  this: Sdk,
  args: CollectionPropertiesArguments,
): Promise<CollectionPropertiesResult> {
  const properties = args.propertyKeys
    ? await this.api.rpc.unique.collectionProperties(
        args.collectionId,
        args.propertyKeys,
      )
    : await this.api.rpc.unique.collectionProperties(args.collectionId);

  return properties.map((property) => ({
    key: bytesToString(property.key),
    value: bytesToString(property.value),
  }));
}

export const collectionPropertiesQuery: QueryMethod<
  CollectionPropertiesArguments,
  CollectionPropertiesResult
> = query;
