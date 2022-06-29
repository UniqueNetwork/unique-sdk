# Set collection limits

## Arguments

- **address** - The address of collection owner
- **collectionId** - ID of the collection to set limits for
- **accountTokenOwnershipLimit** - Maximum number of tokens that one address can own
- **sponsoredDataSize** - Maximum byte size of custom token data that can be sponsored when tokens are minted in sponsored mode
- **sponsoredDataRateLimit** - Defines how many blocks need to pass between setVariableMetadata transactions in order for them to be sponsored
- **tokenLimit** - Total amount of tokens that can be minted in this collection
- **sponsorTransferTimeout** - Time interval in blocks that defines once per how long a non-privileged user transfer or mint transaction can be sponsored
- **sponsorApproveTimeout** - Time interval in blocks that defines once per how long a non-privileged user approve transaction can be sponsored
- **ownerCanTransfer** - Boolean value that tells if collection owner or admins can transfer or burn tokens owned by other non-privileged users
- **ownerCanDestroy** - Boolean value that tells if collection owner can destroy it
- **transfersEnabled** - Flag that defines whether token transfers between users are currently enabled 

## Returns

The method returns a `parsed` object that contains the `collectionId: number`.

## Examples

```typescript
import { SetCollectionLimitsArguments } from '@unique-nft/sdk/tokens/types';
const limitsArgs: SetCollectionLimitsArguments = {
  address: '<your account address>',
  collectionId: '<ID of the collection>',
  accountTokenOwnershipLimit: 1000,
  sponsoredDataSize: 1024,
  sponsoredDataRateLimit: 30,
  tokenLimit: 1000000,
  sponsorTransferTimeout: 6,
  sponsorApproveTimeout: 6,
  ownerCanTransfer: false,
  ownerCanDestroy: false,
  transfersEnabled: false,
};
const createResult = await sdk.collections.setLimits(limitsArgs);
const { collectionId } = createResult.parsed;
```
