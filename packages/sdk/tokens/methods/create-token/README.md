# Create collection

## Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **owner** - The address of token owner (optional)
- **data.image** - Token image (`url`, `urlInfix` or `ipfsCid`)
- **data.encodedAttributes** - Token attributes

## Returns

The method returns a `parsed` object that contains the `collectionId: number, tokenId: number`.

## Examples

```typescript
import { CreateTokenNewArguments } from '@unique-nft/sdk/tokens/methods/create-token';

import {
    UniqueCollectionSchemaToCreate,
    COLLECTION_SCHEMA_NAME,
    AttributeType,
    AttributeKind,
} from '@unique-nft/api';

const createTokenArgs: CreateTokenNewArguments = {
    address: '<your account address>',
    collectionId: 123,
    data: {
        encodedAttributes: {
            '0': 0,
            '1': [0],
            '2': 'foo_bar',
        },
        image: {
            ipfsCid: '<valid_ipfs_cid>',
        },
    },
};

const result = await sdk.tokens.create_new.submitWaitResult(createArgs);
const { collectionId, tokenId } = result.parsed;

const token = await sdk.tokens.get_new({ collectionId, tokenId });
```
