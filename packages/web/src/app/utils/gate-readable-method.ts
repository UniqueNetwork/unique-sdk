import { SdkReadableMethod } from '@unique-nft/sdk/types';
import { Query } from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';

export function createReadableMethod<Q, R> (
  sdk: Sdk,
  method: SdkReadableMethod<Q, R>,
): (args: Q) => Promise<R> {
  return (
    // @Query() args: Q,
    args: Q,
  ): Promise<R> => {
    return method.call(sdk, args);
  }
}
