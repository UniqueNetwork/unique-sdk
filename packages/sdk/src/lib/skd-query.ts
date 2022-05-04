import { ApiPromise } from '@polkadot/api';
import { formatBalance } from '@polkadot/util';
import { Option } from '@polkadot/types-codec';
import { PalletNonfungibleItemData } from '@unique-nft/types';
import { INamespace } from 'protobufjs';
import {
  AddressArg,
  Balance,
  ChainProperties,
  CollectionIdArg,
  CollectionInfo,
  ISdkQuery,
  SdkOptions,
  TokenIdArg,
  TokenInfo,
} from '../types';
import { deserializeConstData } from '../utils/protobuf.utils';
import { decodeCollection } from '../utils/collection-transformers';

export class SkdQuery implements ISdkQuery {
  constructor(readonly options: SdkOptions, readonly api: ApiPromise) {}

  chainProperties(): ChainProperties {
    return {
      SS58Prefix: this.api.registry.chainSS58 || 0,
      token: this.api.registry.chainTokens[0],
      decimals: this.api.registry.chainDecimals[0],
      wsUrl: this.options.chainWsUrl,
    };
  }

  async balance({ address }: AddressArg): Promise<Balance> {
    // todo `get`: this.api[section][method]?
    // todo getBalance(address) { this.get('balances', 'all', address);
    const { availableBalance } = await this.api.derive.balances.all(address);

    return {
      amount: availableBalance.toBigInt().toString(),
      formatted: formatBalance(availableBalance, {
        decimals: this.api.registry.chainDecimals[0],
        withUnit: this.api.registry.chainTokens[0],
      }),
      // todo formatted -> formatted, withUnit, as number?
    };
  }

  async collection({
    collectionId,
  }: CollectionIdArg): Promise<CollectionInfo | null> {
    const collectionOption = await this.api.rpc.unique.collectionById(
      collectionId,
    );
    const collection = collectionOption.unwrapOr(null);

    return collection ? decodeCollection(collectionId, collection) : collection;
  }

  async token({
    collectionId,
    tokenId,
  }: TokenIdArg): Promise<TokenInfo | null> {
    const collection = await this.collection({ collectionId });

    if (!collection) return null;
    const { offchainSchema, constOnChainSchema } = collection;

    const tokenDataOption: Option<PalletNonfungibleItemData> =
      await this.api.query.nonfungible.tokenData(collectionId, tokenId);

    const tokenData = tokenDataOption.unwrapOr(undefined);

    if (!tokenData) return null;

    const { constData, variableData, owner } = tokenData;

    return {
      id: tokenId,
      collectionId,
      url: offchainSchema.replace('{id}', tokenId.toString()),
      constData: deserializeConstData({
        schema: constOnChainSchema as INamespace,
        buffer: constData,
      }),
      variableData: variableData.toString(),
      owner: owner.value.toString(),
    };
  }
}
