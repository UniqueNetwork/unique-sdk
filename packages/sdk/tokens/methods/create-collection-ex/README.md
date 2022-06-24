# Create collection

## Arguments

- **address** - The address of collection owner
- **name** - Collection name (text, up to 64 characters)
- **description** - Collection description (text, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **tokenPrefix** - Token prefix (text, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](#todo)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **properties** - [Collection properties](#todo)
- **permissions** - [Collection permissions](#todo)
- **tokenPropertyPermissions** - [Collection tokens permissions](#todo)

## Returns

The method returns a `parsed` object that contains the `collectionId: number`.

## Examples

```typescript
import { CreateCollectionArguments } from '@unique-nft/sdk/types';
const createArgs: CreateCollectionArguments = {
  address: '<your account address>',
  name: `FOO`,
  description: 'BAR',
  tokenPrefix: 'BAZ',
  properties: {},
};
const createResult = await creation.submitWaitResult(createArgs);
const { collectionId } = createResult.parsed;
const collection = await sdk.collections.get({ collectionId });
```
