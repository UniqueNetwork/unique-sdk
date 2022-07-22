# Set token properties

## Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **tokenId** - Token id
- **properties** - Array of properties `{ key: string, value: string }`

## Returns

The method returns an array of `TokenPropertySet` events.

## Examples

```ts
const args: SetTokenPropertiesArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  collectionId: 1,
  tokenId: 1,
  properties: [
    {
      key: 'foo',
      value: 'bar',
    },
  ],
};

const result = await sdk.tokens.setProperties.submitWaitResult(args);

console.log(result.parsed);
```
