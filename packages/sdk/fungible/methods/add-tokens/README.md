# Add fungible tokens

## Arguments

- **address** - The address of collection owner
- **collectionId** - Collection Id
- **amount** - amount of tokens
- **recipient** - recipient of new tokens, **address** as default

## Returns

- **collectionId** - Collection Id
- **amount** - amount of tokens
- **recipient** - recipient of new tokens

The method add new tokens of the collection to **recipient**

## Examples

```typescript
import { AddTokensArgs } from '@unique-nft/sdk/fungible';

const addTokens: AddTokensArgs = {
    address: '<collection_owner_address>',
    collectionId: 123,
    amount: 777,
    recipient: '<address_of_recipient>'
};

await sdk.fungible.addTokens.submitWaitResult(addTokens);
```
