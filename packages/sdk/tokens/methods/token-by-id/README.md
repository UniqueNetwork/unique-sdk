# Get token

Returns token info and attributes

## Arguments

- **collectionId** - Collection Id
- **tokenId** - Token Id

## Returns

The method returns token info:

- **collectionId** - Collection Id
- **tokenId** - Token Id
- **owner** - The address of token owner
- **image** - Token image (`url`, `urlInfix` or `ipfsCid`)
- **attributes** - Token attributes

## Examples

```typescript
const token = await sdk.tokens.get_new({
  collectionId: 2,
  tokenId: 1,
});
    
const {
    collectionId,
    tokenId,
    owner,
    image,
    attributes,
} = token;
```
