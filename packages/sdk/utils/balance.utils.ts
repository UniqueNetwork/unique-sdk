import { INumber } from '@polkadot/types-codec/types';
import { Balance } from '@unique-nft/sdk/types';
import { ApiPromise } from '@polkadot/api';
import { formatBalance as polkadotFormatBalance } from '@polkadot/util';

export const formatBalance = (api: ApiPromise, raw: INumber): Balance => {
  const withUnit = api.registry.chainTokens[0];
  const decimals = api.registry.chainDecimals[0];

  const formatted = polkadotFormatBalance(raw, { decimals, withUnit });

  const amountWithUnit = polkadotFormatBalance(raw, {
    decimals,
    withUnit,
    forceUnit: '-',
  });

  const amount = parseFloat(amountWithUnit.split(' ')[0]);

  return {
    raw: raw.toString(),
    amount,
    amountWithUnit,
    formatted,
    unit: withUnit,
  };
};
