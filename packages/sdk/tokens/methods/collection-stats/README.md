# Get collection stats

Returns blockchain collection statistics.

## Returns

Blockchain collection stats:

- **created** - The number of total collection created
- **destroyed** - The number of destroyed collection
- **alive** - The number of collections that still alive

## Examples

```typescript
import { CollectionStatsResult } from '@unique-nft/sdk/types';

const collectionStats: CollectionStatsResult =
  await sdk.collections.collectionStats();
```
