# Get effective limits by collection ID

By default, the collection limit is not set (their value is null).
This limit value can be seen when requesting a collection using [Get collection by ID](../collection-by-id) method.
If the limit is not set by the user, then the default limit is actually applied to the collection.
The values of the limits actually applied to the collection (default and user-set) can be obtained using Get effective limits by collection ID method.

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
