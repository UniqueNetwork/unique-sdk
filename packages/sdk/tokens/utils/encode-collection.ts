import { objectSpread } from '@polkadot/util';
import type { Registry } from '@polkadot/types/types';
import type { CollectionInfo } from '@unique-nft/sdk/types';
import type { UpDataStructsCreateCollectionData } from '@unique-nft/types/unique';
import { stringToUTF16 } from '@unique-nft/sdk/utils';

export const encodeCollection = (
  registry: Registry,
  collectionInfo: Partial<CollectionInfo>,
): UpDataStructsCreateCollectionData => {
  const params: object[] = [collectionInfo];

  if (collectionInfo.name) {
    params.push({ name: stringToUTF16(collectionInfo.name) });
  }

  if (collectionInfo.description) {
    params.push({ description: stringToUTF16(collectionInfo.description) });
  }

  if (collectionInfo.tokenPrefix) {
    params.push({ tokenPrefix: stringToUTF16(collectionInfo.tokenPrefix) });
  }

  if (collectionInfo.constOnChainSchema) {
    params.push({
      constOnChainSchema: JSON.stringify(collectionInfo.constOnChainSchema),
    });
  }

  if (collectionInfo.variableOnChainSchema) {
    params.push({
      variableOnChainSchema: JSON.stringify(
        collectionInfo.variableOnChainSchema,
      ),
    });
  }

  return registry.createType<UpDataStructsCreateCollectionData>(
    'UpDataStructsCreateCollectionData',
    objectSpread({}, ...params),
  );
};
