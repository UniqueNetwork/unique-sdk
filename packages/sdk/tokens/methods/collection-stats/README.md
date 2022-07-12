# Get collection stats

Returns blockchain collection statistics.

## Arguments

No arguments required.

## Returns

Blockchain collection stats:

- **created** - The number of total collections created
- **destroyed** - The number of destroyed collections
- **alive** - The number of collections that are still alive

## Examples

```typescript
import { CollectionStatsResult } from '@unique-nft/sdk/types';

const collectionStats: CollectionStatsResult =
  await sdk.collections.collectionStats();
```
