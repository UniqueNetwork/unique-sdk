# Delete collection properties

## Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **propertyKeys** - Array of properties keys

## Returns

The method returns an array of `CollectionPropertyDeleted` events.

## Examples

```ts
const args: DeleteCollectionPropertiesArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  propertyKeys: ['foo', 'bar'],
};

const result = await sdk.collections.deleteProperties.submitWaitResult(args);

console.log(result.parsed);
```
