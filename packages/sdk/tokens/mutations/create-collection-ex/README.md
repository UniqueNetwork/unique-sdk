# Create collection

## Arguments

- **address** - The address of collection owner
- **name** - Collection name (UTF-16 array, up to 64 characters)
- **description** - Collection description (UTF-16, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **tokenPrefix** - Token prefix (UTF-8, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](#todo)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **properties** - [Collection properties](#todo)
- **permissions** - [Collection permissions](#todo)
- **tokenPropertyPermissions** - [Collection tokens permissions](#todo)

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
