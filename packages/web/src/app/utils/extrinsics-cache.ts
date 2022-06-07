import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  ISubmittableResult,
  ExtrinsicResultCallback,
} from '@unique-nft/sdk/types';
import { stringify } from '@polkadot/util';

export class ExtrinsicsCache {
  private readonly logger = new Logger(ExtrinsicsCache.name);

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  getUpdateHandler(): ExtrinsicResultCallback {
    return this.handleUpdate.bind(this);
  }

  private async handleUpdate(result: ISubmittableResult): Promise<void> {
    this.logger.log(
      `handleUpdate - ${result.txHash.toHex()} \n ${stringify(
        result.toHuman(),
        2,
      )}`,
    );

    await this.cache.set(result.txHash.toHex(), result.toHuman(), {
      ttl: 10000,
    });
  }

  async getResult(hash: string): Promise<any> {
    this.logger.log(`getResult - ${hash}`);

    return this.cache.get(hash);
  }
}
