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
import { GetStatsResult } from '@unique-nft/sdk/types';

const stats: GetStatsResult = await sdk.collections.getStats();
```
