# Get effective limits by collection ID

Return the effective limits of the collection instead of null for default values

## Arguments

- **collectionId** - ID of collection

## Returns

Method return collection info:

- **id** - Collection id
- **limits** - [Collection limits](../set-collection-limits#arguments)
## Examples

```typescript
import { CollectionIdArguments, GetCollectionLimitsResult } from '@unique-nft/sdk/types';
const getCollectionArgs: CollectionIdArguments = { collectionId: 123 };
const collection: CollectionInfo = await sdk.collections.getLimits(getCollectionArgs);
```
