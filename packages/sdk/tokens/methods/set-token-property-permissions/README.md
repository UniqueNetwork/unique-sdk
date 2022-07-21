# Set token property permissions

## Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **propertyPermissions** - Array of property permissions `{ key: string, permission: { mutable: boolean, collectionAdmin: boolean, tokenOwner: boolean } }`

## Returns

The method returns an array of `PropertyPermissionSet` events.

## Examples

```ts
const args: SetTokenPropertyPermissionsArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  propertyPermissions: [
    {
      key: 'foo',
      permission: {
        mutable: true,
        collectionAdmin: true,
        tokenOwner: true,
      },
    },
  ],
};

const result =
  await sdk.collections.setTokenPropertyPermissions.submitWaitResult(args);

console.log(result.parsed);
```
