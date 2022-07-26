/* eslint-disable  @typescript-eslint/ban-ts-comment */
import { ApiPromise } from '@polkadot/api';
import {
  ApiGetterArguments,
  ApiMethodArguments,
  ApiRequestArguments,
} from '@unique-nft/sdk/types';
import { BuildQueryError } from '@unique-nft/sdk/errors';

import { serialize } from '@unique-nft/sdk/utils';

interface Sdk {
  api: ApiPromise;
}

function validateRequestParams(sdk: Sdk, query: ApiRequestArguments) {
  const { endpoint, module, method } = query;

  if (!(endpoint in sdk.api)) {
    throw new BuildQueryError(`Invalid endpoint: "${endpoint}"`, { query });
  }
  // @ts-ignore
  if (!(module in sdk.api[endpoint])) {
    throw new BuildQueryError(`Invalid module: "${module}"`, { query });
  }
  // @ts-ignore
  if (!(method in sdk.api[endpoint][module])) {
    throw new BuildQueryError(`Invalid method: "${method}"`, { query });
  }
}

export class SdkStateQueries {
  constructor(private readonly sdk: Sdk) {}

  async execute<T>(query: ApiMethodArguments): Promise<T> {
    const { endpoint, module, method, args } = query;

    validateRequestParams(this.sdk, query);

    let result;
    try {
      // @ts-ignore
      result = await this.sdk.api[endpoint][module][method](...args);
    } catch (error) {
      throw BuildQueryError.wrapError(error, { query });
    }
    return serialize(result);
  }

  async get<T>(query: ApiGetterArguments): Promise<T> {
    const { endpoint, module, method } = query;

    validateRequestParams(this.sdk, query);

    try {
      // @ts-ignore
      const result = await this.sdk.api[endpoint][module][method];
      return serialize(result);
    } catch (error) {
      throw BuildQueryError.wrapError(error, { query });
    }
  }
}
