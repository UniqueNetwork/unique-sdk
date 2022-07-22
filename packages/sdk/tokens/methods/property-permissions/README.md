# Property permissions

Get array of collection property permissions

## Arguments

- **collectionId** - Collection ID
- **propertyKeys** _optional_ - Array of property keys

## Returns

Method return an array of property permissions `{ key: string, permission: { mutable: boolean, collectionAdmin: boolean, tokenOwner: boolean } }`

## Examples

```ts
import {
  PropertyPermissionsArguments,
  PropertyPermissionsResult,
} from '@unique-nft/sdk/tokens/types';

const args: PropertyPermissionsArguments = {
  collectionId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: PropertyPermissionsResult =
  await sdk.collections.propertyPermissions(args);
```
