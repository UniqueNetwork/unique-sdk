import { Address, AddressArguments } from '@unique-nft/sdk/types';
import { UniqueTokenToCreate } from '@unique-nft/api';

export interface CreateTokenNewArguments extends AddressArguments {
  collectionId: number;
  owner?: Address;
  data: UniqueTokenToCreate;
}
