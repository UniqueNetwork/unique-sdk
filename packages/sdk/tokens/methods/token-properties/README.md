# Token properties

Get array of token properties

## Arguments

- **collectionId** - Collection ID
- **tokenId** - Token ID
- **propertyKeys** _optional_ - Array of property keys

## Returns

Method return an array of properties `{ key: string, value: string }`

## Examples

```ts
import {
  TokenPropertiesArguments,
  TokenPropertiesResult,
} from '@unique-nft/sdk/tokens/types';

const args: TokenPropertiesArguments = {
  collectionId: 1,
  tokenId: 1,
  // propertyKeys: ['foo', 'bar'],
};

const result: TokenPropertiesResult = await sdk.tokens.properties(args);
```
