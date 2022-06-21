import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { createSdk, getKeyringPairs } from '@unique-nft/sdk/tests';
import { TxBuildArguments } from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { u128 } from '@polkadot/types-codec';
import { AccountId32 } from '@polkadot/types/interfaces/runtime';
import { findEventRecord } from '@unique-nft/sdk/extrinsics/src/submittable-utils';
import { KeyringPair } from '@polkadot/keyring/types';
import { Sdk } from '@unique-nft/sdk';

/* eslint-disable class-methods-use-this */

type Input = { from: string; to: string; amount: number };

type Result = {
  concatenated: string;
};

class TestMutationMethod extends MutationMethodBase<Input, Result> {
  async transformArgs(args: Input): Promise<TxBuildArguments> {
    return {
      address: args.from,
      section: 'balances',
      method: 'transfer',
      args: [args.to, args.amount],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<Result | undefined> {
    const eventRecord = findEventRecord<[AccountId32, AccountId32, u128]>(
      result,
      'balances',
      'Transfer',
    );

    if (!eventRecord) return undefined;

    const [from, to, amount] = eventRecord.event.data;

    return {
      concatenated: [
        this.sdk.transformAddress(from.toString()),
        this.sdk.transformAddress(to.toString()),
        amount.toString(),
      ].join('_'),
    };
  }
}

describe(MutationMethodBase.name, () => {
  let sdk: Sdk;
  let alice: KeyringPair;
  let bob: KeyringPair;
  let testMethodWrap: TestMutationMethod;

  let transformArgs: jest.Mock;
  let transformResult: jest.Mock;

  beforeAll(async () => {
    sdk = await createSdk({ seed: '//Bob' });
    ({ alice, bob } = await getKeyringPairs());

    testMethodWrap = new TestMutationMethod(sdk);

    transformArgs = jest.fn(testMethodWrap.transformArgs);
    testMethodWrap.transformArgs = transformArgs;

    transformResult = jest.fn(testMethodWrap.transformResult);
    testMethodWrap.transformResult = transformResult;
  });

  it('method works', async () => {
    const testMethod = testMethodWrap.getMethod();

    const from = sdk.transformAddress(bob.address);
    const to = sdk.transformAddress(alice.address);
    const amount = 100;

    const result = await testMethod({ from, to, amount }, 'WaitCompleted');

    expect(result.parsed?.concatenated).toEqual([from, to, amount].join('_'));

    expect(transformArgs).toBeCalledTimes(1);
    expect(transformArgs).toBeCalledWith({ from, to, amount });

    expect(transformResult.mock.calls.length).toBeGreaterThan(1);
  }, 45_000);
});
