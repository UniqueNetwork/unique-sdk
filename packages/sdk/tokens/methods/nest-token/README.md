# Nest token

Nesting is a process of forming a structural relationship between two NFTs that form a parent-child relationship in a tree structure. Such a relationship is formed by forwarding token A2 to the address of token A1 by which A2 becomes a child of token A1 (conversely, token A1 becomes the parent of A2).

## Arguments

- **address** - Owner address
- **parent** - Parent token object `{ collectionId: number, tokenId: number }`
- **nested** - Nested token object `{ collectionId: number, tokenId: number }`

## Returns

The method returns a `parsed` object that contains `{ collectionId: number, tokenId: number }`

## Examples

```ts
import { NestTokenArguments } from '@unique-nft/sdk/tokens/types';

const args: NestTokenArguments = {
  address: '5HNid8gyLiwocM9PyGVQetbWoBY76SrixnmjTRtewgaicKRX',
  parent: {
    collectionId: 1,
    tokenId: 1,
  },
  nested: {
    collectionId: 1,
    tokenId: 2,
  },
};

const result = await sdk.tokens.nestToken.submitWaitResult(args);

const { tokenId, collectionId } = result.parsed;

console.log(
  `Token ${tokenId} from collection ${collectionId} successfully nested`,
);
```
