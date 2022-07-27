# Transfer token

## Arguments

- **from** - Sender address
- **to** - Recipient
- **collectionId** - Collection id
- **tokenId** - Token id

## Returns

The method returns an `Transfer` event.

## Examples

```ts
const args: TransferArguments = {
  from: '<address>',
  to: '<address>',
  collectionId: 1,
  tokenId: 1,
};

const result = await sdk.tokens.transfer.submitWaitResult(args);

console.log(result.parsed);
```
