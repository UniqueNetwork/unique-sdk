import { ApiPromise } from '@polkadot/api';
import { IExtrinsic } from '@polkadot/types/types/extrinsic';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { CacheStore } from '@unique-nft/sdk/types';
import { SubmitExtrinsicError } from '@unique-nft/sdk/errors';

import {
  ExtrinsicResult,
  processDefault,
  processFail,
  processInBlock,
  processPending,
} from './extrinsic-result-utils';

export class ExtrinsicWatcher {
  constructor(
    private readonly api: ApiPromise,
    private readonly cache: CacheStore,
  ) {}

  async submitAndWatch(extrinsic: IExtrinsic): Promise<ExtrinsicResult> {
    const extrinsicHash = extrinsic.hash;

    let unsubscribe: () => void = () => {
      console.log(`unsubscribe - ${extrinsicHash} noop unsubscribe called`);
    };

    const stopWatching = () => {
      console.log(`stopWatching - ${extrinsicHash}`);
      unsubscribe();
    };

    const onStatusUpdate = async (status: ExtrinsicStatus): Promise<void> => {
      console.log(`onStatusUpdate - ${status.type}`);

      switch (status.type) {
        case 'InBlock':
        case 'Finalized': {
          stopWatching();

          const result = await processInBlock(this.api, extrinsicHash, status);

          console.log(`in block or finalized - ${result}`);

          await this.cache.set<ExtrinsicResult>(extrinsicHash.toHex(), result);

          break;
        }
        case 'FinalityTimeout':
        case 'Usurped':
        case 'Dropped':
        case 'Invalid': {
          stopWatching();

          await this.cache.set<ExtrinsicResult>(
            extrinsicHash.toHex(),
            processFail(extrinsicHash, status),
          );

          break;
        }
        default: {
          if (status.isReady)
            await this.cache.set<ExtrinsicResult>(
              extrinsicHash.toHex(),
              processPending(extrinsicHash, status),
            );

          break;
        }
      }
    };

    try {
      unsubscribe = await this.api.rpc.author.submitAndWatchExtrinsic(
        extrinsic,
        onStatusUpdate,
      );

      const result = processDefault(extrinsicHash, true);
      await this.cache.set<ExtrinsicResult>(extrinsicHash.toHex(), result);

      return result;
    } catch (error) {
      const errorMessage =
        error && error instanceof Error ? error.message : undefined;
      throw new SubmitExtrinsicError(errorMessage);
    }
  }
}
