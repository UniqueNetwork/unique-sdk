# Topmost token owner

Return substrate address of topmost token owner

## Arguments

- **collectionId** - ID of token collection
- **tokenId** - ID of token
- **blockHashAt** _optional_ - hash of execution block

## Returns

Return substrate address as `string`

## Examples

```ts
import {
  TopmostTokenOwnerArguments,
  TopmostTokenOwnerResult,
} from '@unique-nft/sdk/tokens/types';

const args: TopmostTokenOwnerArguments = {
  collectionId: 1,
  tokenId: 1,
  // blockHashAt: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
};

const result: TopmostTokenOwnerResult = await sdk.tokens.topmostTokenOwner(
  args,
);
```
