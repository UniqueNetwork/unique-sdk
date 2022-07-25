import { formatBalance } from '@unique-nft/sdk/utils';
import { Balance } from '@unique-nft/sdk/types';

const options = { decimals: 3, unit: 'FOO' };

describe(formatBalance.name, () => {
  const cases: Array<[string, Omit<Balance, 'decimals' | 'unit'>]> = [
    ['', { raw: '0', amount: '0', formatted: '0' }],
    ['1', { raw: '1', amount: '0.001', formatted: '1.0000 m' }],
    ['-1', { raw: '-1', amount: '-0.001', formatted: '-1.0000 m' }],
    ['1000', { raw: '1000', amount: '1', formatted: '1.0000' }],
    ['100000', { raw: '100000', amount: '100', formatted: '100.0000' }],
  ];

  it.each(cases)('%s', (sample, expected) => {
    expect(formatBalance(options, sample)).toEqual<Balance>({
      ...expected,
      ...options,
    });
  });
});
