# Collection tokens

Get tokens contained within a collection

## Arguments

- **collectionId** - Collection ID

## Returns

Method returns array of tokenIds contained within passed collection.

## Examples

```ts
import { CollectionTokensResult } from '@unique-nft/sdk/tokens/types';

const result: CollectionTokensResult = await sdk.collections.tokens({
  collectionId: 1,
});
```
