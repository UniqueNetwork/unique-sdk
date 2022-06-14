import {
  SdkWritableMethod,
  TxBuildOptions,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { Sdk } from '@unique-nft/sdk';
import { encodeCollection } from '@unique-nft/sdk/tokens';
import { CreateCollectionArguments } from './types';

export const createCollectionEx: SdkWritableMethod<CreateCollectionArguments> = function (
  this: Sdk,
  collection: CreateCollectionArguments,
  buildExtrinsicOptions?: TxBuildOptions,
): Promise<UnsignedTxPayload> {
  const { address, ...rest } = collection;

  const encodedCollection = encodeCollection(
    this.api.registry,
    rest,
  ).toHex();

  return this.extrinsics.build({
    address,
    section: 'unique',
    method: 'createCollectionEx',
    args: [encodedCollection],
  }, buildExtrinsicOptions);
}
