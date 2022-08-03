# Create collection (new)

## Arguments

- **address** - The address of collection owner
- **name** - Collection name (text, up to 64 characters)
- **description** - Collection description (text, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **tokenPrefix** - Token prefix (text, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - [Collection limits](../set-collection-limits#arguments)
- **metaUpdatePermission** - [Permission](#todo) for update meta (ItemOwner, Admin, None)
- **permissions** - [Collection permissions](#todo)
- **schema** - [Collection schema](#todo)

## Returns

The method returns a `parsed` object that contains the `collectionId: number`.

## Examples

```typescript
import {
    UniqueCollectionSchemaToCreate,
    CollectionSchemaName,
    AttributeType,
    AttributeKind,
    CreateCollectionNewArguments,
} from '@unique-nft/sdk/tokens';

const collectionSchema: UniqueCollectionSchemaToCreate = {
    schemaName: COLLECTION_SCHEMA_NAME.unique,
    schemaVersion: '1.0.0',
    attributesSchemaVersion: '1.0.0',
    attributesSchema: {
        image: { urlTemplate: 'some_url/{infix}.extension' },
        '0': {
            name: 'just_string_attribute',
            type: AttributeType.string,
            kind: AttributeKind.freeValue,
        },
    },
    coverPicture: {
        ipfsCid: '<valid_ipfs_cid>',
    },
};

const createArgs: CreateCollectionArguments = {
  address: '<your account address>',
  name: `FOO`,
  description: 'BAR',
  tokenPrefix: 'BAZ', 
  schema: collectionSchema,
};

const createResult = await sdk.collections.creation_new.submitWaitResult(createArgs);
const { collectionId } = createResult.parsed;

const collection = await sdk.collections.get({ collectionId });
```
