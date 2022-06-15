import { SdkReadableMethod } from '@unique-nft/sdk/types';
import { Sdk } from '@unique-nft/sdk';

export function createReadableMethod<Q, R>(
  sdk: Sdk,
  method: SdkReadableMethod<Q, R>,
): (args: Q) => Promise<R> {
  return (
    // @Query() args: Q,
    args: Q,
  ): Promise<R> => method.call(sdk, args);
}
