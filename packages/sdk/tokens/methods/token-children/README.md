# Token children

Get array of nested tokens

## Arguments

- **collectionId** - ID of token collection
- **tokenId** - ID of token

## Returns

Method return an array of tokens `{ collectionId: number, tokenId: number }`

## Examples

```ts
import {
  TokenChildrenArguments,
  TokenChildrenResult,
} from '@unique-nft/sdk/tokens/types';

const args: TokenChildrenArguments = {
  collectionId: 1,
  tokenId: 1,
};

const result: TokenChildrenResult = await sdk.tokens.tokenChildren(args);
```
