import {
  Address,
  AddressArguments,
  TxBuildArguments,
  CrossAccountId,
  TokenPayload,
} from '@unique-nft/sdk/types';
import { UniqueTokenToCreate } from '@unique-nft/api';

export type {
  UniqueTokenToCreate,
  EncodedTokenAttributes,
} from '@unique-nft/api';

export interface CreateTokenNewArguments extends AddressArguments {
  collectionId: number;
  owner?: Address;
  data: UniqueTokenToCreate;
}

export interface CreateTokenNewBuildArguments extends TxBuildArguments {
  args: [number, CrossAccountId, TokenPayload];
}
