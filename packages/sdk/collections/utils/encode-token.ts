import { INamespace } from 'protobufjs';
import { u8aToHex } from '@polkadot/util';
import { TokenPayload } from '@unique-nft/sdk/types';
import { serializeConstData } from '@unique-nft/sdk/utils';

/* eslint-disable  @typescript-eslint/no-explicit-any */

export const encodeToken = (
  constData?: Record<string, any>,
  constOnChainSchema?: INamespace | null,
): TokenPayload => {
  if (!constData || !constOnChainSchema) return { NFT: null };

  return {
    NFT: {
      constData: u8aToHex(serializeConstData(constData, constOnChainSchema)),
    },
  };
};
