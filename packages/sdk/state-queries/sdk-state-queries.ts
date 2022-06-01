/* eslint-disable  @typescript-eslint/ban-ts-comment */
import { ApiPromise } from '@polkadot/api';
import { ApiQueryArguments } from '@unique-nft/sdk/types';
import { BuildQueryError } from '@unique-nft/sdk/errors';

import { serialize } from '@unique-nft/sdk/utils';

interface Sdk {
  api: ApiPromise;
}

export class SdkStateQueries {
  constructor(private readonly sdk: Sdk) {}

  async execute(query: ApiQueryArguments): Promise<any> {
    const { endpoint, module, method, args } = query;

    if (!(endpoint in this.sdk.api)) {
      throw new BuildQueryError({ query }, `Invalid endpoint: "${endpoint}"`);
    }
    // @ts-ignore
    if (!(module in this.sdk.api[endpoint])) {
      throw new BuildQueryError({ query }, `Invalid module: "${module}"`);
    }
    // @ts-ignore
    if (!(method in this.sdk.api[endpoint][module])) {
      throw new BuildQueryError({ query }, `Invalid method: "${method}"`);
    }

    let result;
    try {
      // @ts-ignore
      result = await this.sdk.api[endpoint][module][method](...args);
    } catch (error) {
      const errorMessage =
        error && error instanceof Error ? error.message : undefined;
      throw new BuildQueryError({ query }, errorMessage);
    }
    return serialize(result);
  }
}
