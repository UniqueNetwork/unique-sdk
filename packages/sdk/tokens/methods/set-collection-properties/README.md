# Set collection properties

## Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **properties** - Array of properties `{ key: string, value: string }`

## Returns

The method returns an array of `CollectionPropertySet` events.

## Examples

```ts
const args: SetCollectionPropertiesArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  properties: [
    {
      key: 'foo',
      value: 'bar',
    },
  ],
};

const result = await sdk.collections.setProperties.submitWaitResult(args);

console.log(result.parsed);
```
