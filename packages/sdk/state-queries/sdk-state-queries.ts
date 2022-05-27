/* eslint-disable  @typescript-eslint/ban-ts-comment */
import { ApiPromise } from '@polkadot/api';
import { QueryArguments } from '@unique-nft/sdk/types';
import { BuildQueryError } from '@unique-nft/sdk/errors';

interface Sdk {
  api: ApiPromise;
}

export class SdkStateQueries {
  constructor(private readonly sdk: Sdk) {}

  async execute(query: QueryArguments): Promise<any> {
    const { controller, section, method, args } = query;

    if (!(controller in this.sdk.api)) {
      throw new BuildQueryError(
        { query },
        `Invalid controller: "${controller}"`,
      );
    }
    // @ts-ignore
    if (!(section in this.sdk.api[controller])) {
      throw new BuildQueryError({ query }, `Invalid section: "${section}"`);
    }
    // @ts-ignore
    if (!(method in this.sdk.api[controller][section])) {
      throw new BuildQueryError({ query }, `Invalid method: "${method}"`);
    }

    let result;
    try {
      // @ts-ignore
      result = await this.sdk.api[controller][section][method](...args);
    } catch (error) {
      const errorMessage =
        error && error instanceof Error ? error.message : undefined;
      throw new BuildQueryError({ query }, errorMessage);
    }
    return result;
  }
}
