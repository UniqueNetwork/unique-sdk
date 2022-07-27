# Remove sponsor of collection

## Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id

## Returns

The method returns a `parsed` object that contains the `collectionId: number`.

## Examples

```typescript
import { RemoveCollectionSponsorArguments } from '@unique-nft/sdk/tokens/methods/remove-collection-sponsor';

const removeArgs: SetCollectionSponsorArguments = {
  address: '<Account address of owner of collection>',
  collectionId: '<ID of the collection>',
};

const result = await sdk.collections.removeCollectionSponsor.submitWaitResult(removeArgs);
const { collectionId } = result.parsed;
```
