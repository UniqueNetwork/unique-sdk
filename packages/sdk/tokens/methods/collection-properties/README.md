# Collection properties

Get array of collection properties

## Arguments

- **collectionId** - Collection ID
- **propertyKeys** _optional_ - Array of property keys

## Returns

Method return an array of properties `{ key: string, value: string }`

## Examples

```ts
import {
  CollectionPropertiesArguments,
  CollectionPropertiesResult,
} from '@unique-nft/sdk/tokens/types';

const args: CollectionPropertiesArguments = {
  collectionId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: CollectionPropertiesResult = await sdk.collections.properties(
  args,
);
```
