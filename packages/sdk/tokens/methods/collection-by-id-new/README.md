# Get collection by Id

Returns collection info (with Unique schema)

## Arguments

- **collectionId** - Id of collection

## Returns

Method return collection info:

- **id** - Collection id
- **owner** - The address of collection owner
- **name** - Collection name (text, up to 64 characters)
- **description** - Collection description (text, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **tokenPrefix** - Token prefix (text, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](../set-collection-limits#arguments)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **permissions** - [Collection permissions](#todo)
- **schema** - [Collection schema](#todo)

## Examples

```typescript
const collection = await sdk.collections.get_new({ collectionId: 2 });

const { id, owner, name, description, mode, tokenPrefix, schema } = collection;
```
