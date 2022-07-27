# Set sponsor of collection

## Arguments

- **address** - The address of collection owner
- **collectionId** - Collection id
- **newSponsor** - The address of new sponsor of the collection

## Returns

The method returns a `parsed` object that contains the `collectionId: number, sponsor: string`.

## Examples

```typescript
import { SetCollectionSponsorArguments } from '@unique-nft/sdk/tokens/methods/set-collection-sponsor';

import {
    UniqueCollectionSchemaToCreate,
    COLLECTION_SCHEMA_NAME,
    AttributeType,
    AttributeKind,
} from '@unique-nft/api';

const setSponsorArgs: SetCollectionSponsorArguments = {
    address: '<Account address of owner of collection>',
    collectionId: '<ID of the collection>',
    newSponsor: '<Account addres of new sponsor>',
};

const result = await sdk.collections.setCollectionSponsor.submitWaitResult(setSponsorArgs);
const { collectionId, sponsor } = result.parsed;
```
