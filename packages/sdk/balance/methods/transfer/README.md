# Balance transfer

## Arguments

- **address** - Wallet address to withdraw from
- **destination** - Wallet address for replenishment
- **amount** - Number of coins transferred

## Returns

The method returns a `parsed` object that contains the `success: boolean`.

## Examples

```typescript
import { TransferBuildArguments } from '@unique-nft/sdk/types';
const transferArgs: TransferBuildArguments = {
  address: '<from account address>',
  destination: '<to account address>',
  amount: 0.001,
};
const transferResult = await sdk.balance.transfer.submitWaitResult(transferArgs);
const { success } = transferResult.parsed;
```
