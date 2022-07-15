# Create collection

## Arguments

- **address** - The address of collection owner
- **name** - Collection name (text, up to 64 characters)
- **description** - Collection description (text, up to 256 characters)
- **mode** - The collection type - Fungible
- **decimals** - decimal part for tokens in collection
- **tokenPrefix** - Token prefix (text, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](../set-collection-limits#arguments)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **permissions** - [Collection permissions](#todo)

## Returns

The method returns a `parsed` object that contains the `collectionId: number`.

## Examples

```typescript
import { CreateFungibleCollectionArguments } from '@unique-nft/sdk/fungible';

const collectionCreateArgs: CreateFungibleCollectionArguments = {
    address: '<valid_address>',
    name: 'Test fungible collection',
    description: 'just test',
    tokenPrefix: 'TEST',
    decimals: 10,
};

const createResult = await sdk.fungible.createCollection.submitWaitResult(collectionCreateArgs);

const { collectionId } = createResult.parsed;

const collection = await sdk.fungible.getCollection({ collectionId });
```
