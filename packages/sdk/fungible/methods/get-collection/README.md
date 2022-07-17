# Get fungible collection by Id

Returns collection info in human format.

## Arguments

- **collectionId** - ID of collection

## Returns

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

## Examples

```typescript
const {
    name,
    description,
    decimals,
    ...rest
} = await sdk.fungible.getCollection({ collectionId: 123 });
```
