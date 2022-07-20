# Transfer fungible tokens

## Arguments

- **address** - The address of tokens owner
- **collectionId** - ID of the collection
- **recipient** - The address of recipient
- **amount** - count of tokens

## Returns

- **sender** - The address of tokens owner
- **collectionId** - ID of the collection
- **recipient** - The address of recipient
- **amount** - count of tokens

## Examples

```typescript
import { TransferTokensArgs } from '@unique-nft/sdk/fungible';

const transferArgs: TransferTokensArgs = {
    address: '<your_address>',
    collectionId: 123,
    recipient: '<recipient_address>',
    amount: 100.1,
};

await sdk.fungible.transferTokens.submitWaitResult(transferArgs);
```
