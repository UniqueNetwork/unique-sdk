# Confirm sponsorship of collection

## Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id

## Returns

The method returns a `parsed` object that contains the `collectionId: number, sponsor: string`.

## Examples

```typescript
import { ConfirmSponsorshipArguments } from '@unique-nft/sdk/tokens/methods/confirm-sponsorship';

const confirmArgs: ConfirmSponsorshipArguments = {
  address: '<Account address of owner of collection>',
  collectionId: '<ID of the collection>',
};

const result = await sdk.collections.confirmSponsorship.submitWaitResult(confirmArgs);
const { collectionId, sponsor } = result.parsed;
```
