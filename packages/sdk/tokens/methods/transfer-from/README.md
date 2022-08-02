# Transfer from

## Arguments

- **address** - Signer address
- **from** - Sender address
- **to** - Recipient address
- **collectionId** - Collection id
- **tokenId** - Token id

## Returns

The method returns an `Transfer` event.

## Examples

```ts
import { TransferFromArguments } from '@unique-nft/sdk/tokens';

const args: TransferFromArguments = {
  address: '<address'>,
  from: '<address>',
  to: '<address>',
  collectionId: 1,
  tokenId: 1,
};

const result = await sdk.tokens.transferFrom.submitWaitResult(args);

console.log(result.parsed);
```
