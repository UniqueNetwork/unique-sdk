import {
  CollectionInfo,
  CollectionMode,
  SdkWritableMethod,
  TxBuildArguments,
  TxBuildOptions,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { Sdk } from '@unique-nft/sdk';
import { encodeCollection } from '@unique-nft/sdk/tokens';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { u32, u8 } from '@polkadot/types-codec';
import { AccountId32 } from '@polkadot/types/interfaces/runtime';
import { buildMutationMethod } from '@unique-nft/sdk/extrinsics/src/build-mutation-method';
import { CreateCollectionArguments } from './types';

export const createCollectionEx: SdkWritableMethod<CreateCollectionArguments> =
  function (
    this: Sdk,
    collection: CreateCollectionArguments,
    buildExtrinsicOptions?: TxBuildOptions,
  ): Promise<UnsignedTxPayload> {
    const { address, ...rest } = collection;

    const encodedCollection = encodeCollection(this.api.registry, rest).toHex();

    return this.extrinsics.build(
      {
        address,
        section: 'unique',
        method: 'createCollectionEx',
        args: [encodedCollection],
      },
      buildExtrinsicOptions,
    );
  };

const argsToBuildArgs = (
  sdk: Sdk,
  collection: CreateCollectionArguments,
): TxBuildArguments => {
  const { address, ...rest } = collection;

  const encodedCollection = encodeCollection(sdk.api.registry, rest).toHex();

  return {
    address,
    section: 'unique',
    method: 'createCollectionEx',
    args: [encodedCollection],
  };
};

const parseResult = (
  sdk: Sdk,
  result: ISubmittableResult,
): CollectionInfo | undefined => {
  const createCollectionEvent = result.findRecord(
    'common',
    'CollectionCreated',
  );

  if (!createCollectionEvent) return undefined;

  const [id, mode, owner] = createCollectionEvent.event.data as unknown as [
    u32,
    u8,
    AccountId32,
  ];

  return {
    id: id.toNumber(),
    owner: owner.toString(),

    // meh, going to make some additional queries by SDK and fetch this info
    mode: mode.eq(1) ? CollectionMode.Nft : CollectionMode.Fungible,
    description: '',
    limits: undefined,
    metaUpdatePermission: undefined,
    name: '',
    permissions: undefined,
    properties: {},
    sponsorship: undefined,
    tokenPrefix: '',
    tokenPropertyPermissions: undefined,
  };
};

export const createCollectionEx2 = buildMutationMethod<
  CreateCollectionArguments,
  CollectionInfo
>(argsToBuildArgs, parseResult);
