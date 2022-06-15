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
      throw new BuildQueryError(`Invalid endpoint: "${endpoint}"`, { query });
    }
    // @ts-ignore
    if (!(module in this.sdk.api[endpoint])) {
      throw new BuildQueryError(`Invalid module: "${module}"`, { query });
    }
    // @ts-ignore
    if (!(method in this.sdk.api[endpoint][module])) {
      throw new BuildQueryError(`Invalid method: "${method}"`, { query });
    }

    let result;
    try {
      // @ts-ignore
      result = await this.sdk.api[endpoint][module][method](...args);
    } catch (error) {
      throw BuildQueryError.wrapError(error, { query });
    }
    return serialize(result);
  }
}
