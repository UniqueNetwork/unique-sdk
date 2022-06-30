import { AnyMutation } from '@unique-nft/sdk/extrinsics/src/any-mutation';
import {
  createSdk,
  getKeyringPairs,
} from '@unique-nft/sdk/tests/testing-utils';
import { SeedSigner } from '@unique-nft/account/sign';

describe(AnyMutation.name, () => {
  it('works', async () => {
    const { alice, bob } = await getKeyringPairs();
    const sdk = await createSdk({ seed: '//Bob' });

    const mutationWrap = new AnyMutation(sdk);

    const mutationResult$ = mutationWrap.submitWatch({
      address: bob.address,
      section: 'balances',
      method: 'transfer',
      args: [alice.address, 100],
    });

    return new Promise<void>((resolve, reject) => {
      const mockFn = jest.fn();
      mutationResult$.subscribe(mockFn);

      mutationResult$.subscribe({
        complete: () => {
          expect(mockFn.mock.calls.length).toBeGreaterThan(1);
          const [lastCall] = mockFn.mock.calls.pop();
          expect(lastCall).toMatchObject({ parsed: true });

          setTimeout(resolve, 1000);
        },
        error: reject,
      });
    });
  }, 30_000);

  it('sign mutation option', async () => {
    const sdk = await createSdk();
    const { alice, bob } = await getKeyringPairs();

    const mutationWrap = new AnyMutation(sdk);

    const mutationArgs = {
      address: bob.address,
      section: 'balances',
      method: 'transfer',
      args: [alice.address, 100],
    };

    const signer = new SeedSigner({ seed: '//Bob' });

    await expect(() => mutationWrap.submit(mutationArgs)).rejects.toThrowError(
      'No sign provided',
    );

    await expect(() => mutationWrap.submit(mutationArgs, { signer })).resolves;
  });
});
