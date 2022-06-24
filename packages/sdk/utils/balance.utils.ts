import { INumber } from '@polkadot/types-codec/types';
import { Balance } from '@unique-nft/sdk/types';
import { ApiPromise } from '@polkadot/api';
import { formatBalance as polkadotFormatBalance } from '@polkadot/util';

type FormatOptions = {
  decimals: number;
  unit: string;
};

const getOptions = (
  apiOrOptions: ApiPromise | FormatOptions,
): FormatOptions => {
  if ('registry' in apiOrOptions) {
    return {
      decimals: apiOrOptions.registry.chainDecimals[0],
      unit: apiOrOptions.registry.chainTokens[0],
    };
  }

  return apiOrOptions;
};

type AnyNumber = INumber | number | string;

const getAmount = (raw: string, decimals: number): string => {
  if (raw === '0') return '0';

  if (decimals >= raw.length) {
    return `0.${raw.padStart(decimals, '0')}`;
  }

  const dotPosition = raw.length - decimals;

  let decimalPart = raw.slice(dotPosition).replace(/0+$/, '');
  if (decimalPart.length) decimalPart = `.${decimalPart}`;

  return raw.slice(0, dotPosition) + decimalPart;
};

export function formatBalance(options: FormatOptions, raw: AnyNumber): Balance;
export function formatBalance(api: ApiPromise, raw: AnyNumber): Balance;
export function formatBalance(
  apiOrOptions: ApiPromise | FormatOptions,
  num: AnyNumber,
): Balance {
  const options = getOptions(apiOrOptions);
  const { decimals } = options;

  let sign = '';
  let text = num.toString();

  if (text[0] === '-') {
    sign = '-';
    text = text.slice(1);
  }

  if (text.length === 0) text = '0';

  const amount = sign + getAmount(text, decimals);
  const formatted = polkadotFormatBalance(num, { decimals, withUnit: false });
  const raw = sign + text;

  return {
    raw,
    amount,
    formatted,
    ...options,
  };
}
