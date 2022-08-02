# Destroys a concrete instance of NFT

## Arguments

- **collectionId** - ID of the collection
- **tokenId** - ID of NFT to burn
- **value** - amount to burn
  - non-fungible mode: `ignored` (only the whole token can be burned)
  - fungible mode: `must specify` transferred amount
  - re-fungible mode: `ignored` (the owned portion is burned completely)

## Returns

The method returns a `parsed` object that contains the `collectionId: number, tokenId: number, address: string, value: number`.

## Examples

```ts
import '@unique-nft/sdk/tokens';
import { BurnItemArguments } from '@unique-nft/sdk/tokens/types';
const burnItemArgs: BurnItemArguments = {
  tokenId: 1,
  collectionId: 1,
  value: 1
};
const setResult = await sdk.tokens.burn.submitWaitResult(burnItemArgs);
const { collectionId, tokenId, address, value } = setResult.parsed;
```
