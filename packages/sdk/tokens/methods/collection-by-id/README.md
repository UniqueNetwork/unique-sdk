# Get collection by ID

Returns collection info in human format.

## Arguments

- **collectionId** - ID of collection

## Examples

```typescript
import { CollectionIdArguments, CollectionInfo } from '@unique-nft/sdk/types';
const getCollectionArgs: CollectionIdArguments = { collectionId: 123 };
const collection: CollectionInfo = await sdk.collections.get(getCollectionArgs);
```
