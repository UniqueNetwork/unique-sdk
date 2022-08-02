# Collection tokens

Get tokens contained within a collection

## Arguments

- **collectionId** - Collection ID

## Returns

## todo: write me!!!

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
