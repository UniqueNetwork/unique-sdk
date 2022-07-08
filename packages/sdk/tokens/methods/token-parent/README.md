# Token parent

Return info about token parent

## Arguments

- **collectionId** - ID of token collection
- **tokenId** - ID of token

## Returns

Method return an object of token parent

- **collectionId** - ID of parent collection
- **tokenId** - ID of parent token
- **address** - Token owner address

## Examples

```ts
import {
  TokenParentArguments,
  TokenParentResult,
} from '@unique-nft/sdk/tokens/types';

const args: TokenParentArguments = {
  collectionId: 1,
  tokenId: 1,
};

const result: TokenParentResult = await sdk.tokens.tokenParent(args);
```
