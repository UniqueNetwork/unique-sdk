import { formatBalance } from '@polkadot/util';
import { Option } from '@polkadot/types-codec';
import { PalletNonfungibleItemData } from '@unique-nft/types';
import { Sdk } from '@unique-nft/sdk';
import {
  AddressArg,
  Balance,
  ChainProperties,
  CollectionIdArg,
  CollectionInfo,
  ISdkQuery,
  TokenIdArg,
  TokenInfo,
} from '../types';
import { decodeCollection } from '../utils/collection-transformers';
import { decodeToken } from '../utils/token-transformers';
import { validate } from '../utils/validator';

export class SkdQuery implements ISdkQuery {
  constructor(
    private readonly sdk: Sdk,
  ) {}

  chainProperties(): ChainProperties {
    return {
      SS58Prefix: this.sdk.api.registry.chainSS58 || 0,
      token: this.sdk.api.registry.chainTokens[0],
      decimals: this.sdk.api.registry.chainDecimals[0],
      wsUrl: this.sdk.options.chainWsUrl,
    };
  }

  async balance(args: AddressArg): Promise<Balance> {
    await validate(args, AddressArg);
    // todo `get`: this.api[section][method]?
    // todo getBalance(address) { this.get('balances', 'all', address);
    const { availableBalance } = await this.sdk.api.derive.balances.all(
      args.address,
    );

    return {
      amount: availableBalance.toBigInt().toString(),
      formatted: formatBalance(availableBalance, {
        decimals: this.sdk.api.registry.chainDecimals[0],
        withUnit: this.sdk.api.registry.chainTokens[0],
      }),
      // todo formatted -> formatted, withUnit, as number?
    };
  }

  async collection({
    collectionId,
  }: CollectionIdArg): Promise<CollectionInfo | null> {
    const collectionOption = await this.sdk.api.rpc.unique.collectionById(
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

    const tokenDataOption: Option<PalletNonfungibleItemData> =
      await this.sdk.api.query.nonfungible.tokenData(collectionId, tokenId);

    const tokenData = tokenDataOption.unwrapOr(undefined);

    if (!tokenData) return null;

    return decodeToken(collection, tokenId, tokenData, this.sdk.options);
  }
}
