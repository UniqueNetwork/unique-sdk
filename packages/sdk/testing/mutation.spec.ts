import { AnyMutation } from '@unique-nft/sdk/extrinsics/src/any-mutation';
import {
  createPoorAccount,
  createRichAccount,
  createSdk,
} from '@unique-nft/sdk/testing';
import { KeyringProvider } from '@unique-nft/accounts/keyring';

describe(AnyMutation.name, () => {
  it('works', async () => {
    const sdk = await createSdk(true);
    const richAccount = createRichAccount();
    const poorAccount = createPoorAccount();

    const mutationWrap = new AnyMutation(sdk);

    const { result$ } = await mutationWrap.submitWatch({
      address: richAccount.address,
      section: 'balances',
      method: 'transfer',
      args: [poorAccount.address, 100],
    });

    return new Promise<void>((resolve, reject) => {
      const mockFn = jest.fn();
      result$.subscribe(mockFn);

      result$.subscribe({
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
    const sdk = await createSdk(false);
    const richAccount = createRichAccount();
    const poorAccount = createPoorAccount();

    const mutationWrap = new AnyMutation(sdk);

    const mutationArgs = {
      address: richAccount.address,
      section: 'balances',
      method: 'transfer',
      args: [poorAccount.address, 100],
    };

    const provider = new KeyringProvider();
    const signer = provider.addSeed(richAccount.seed).getSigner();

    await expect(() => mutationWrap.submit(mutationArgs)).rejects.toThrowError(
      'No signer provided',
    );

    await expect(() => mutationWrap.submit(mutationArgs, { signer })).resolves;
  });
});
