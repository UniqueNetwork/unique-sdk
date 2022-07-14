# Delete token properties

## Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **tokenId** - Token id
- **propertyKeys** - Array of properties keys

## Returns

The method returns an array of `TokenPropertyDeleted` events.

```ts
const args: DeleteTokenPropertiesArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  tokenId: 1,
  propertyKeys: ['foo', 'bar'],
};

const result = await sdk.tokens.deleteProperties.submitWaitResult(args);

console.log(result.parsed);
```
