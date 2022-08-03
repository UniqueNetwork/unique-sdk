# Approve

Set, change, or remove approved address to transfer the ownership of the token. The Amount value must be between 0 and owned amount or 1 for NFT.

## Arguments

- **spender** - Address that is approved to transfer this token
- **collectionId** - Collection id
- **tokenId** - Token id
- **amount** - Must be true (for approval) or false (for disapproval)

## Returns

The method returns a `parsed` object that contains the `collectionId: number, tokenId: number`.

## Examples

```typescript
import { ApproveArguments } from '@unique-nft/sdk/tokens/methods/approve';

const approveArgs: ApproveArguments = {
    spender: '<Account address for whom token will be approved>',
    collectionId: '<ID of the collection>',
    tokenId: '<ID of the token>',
    amount: true
};

const result = await sdk.tokens.approve.submitWaitResult(approveArgs);
const { collectionId, tokenId } = result.parsed;
```
