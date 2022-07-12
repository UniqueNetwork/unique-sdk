<div align="center">
    <img width="400px" src="../doc/logo-white.svg" alt="Unique Network">

[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
[![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/)
![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/web?style=flat-square)
![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-sdk?style=flat-square)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
![GitHub Release Date](https://img.shields.io/github/release-date/uniquenetwork/unique-sdk?style=flat-square)
![GitHub](https://img.shields.io/github/v/tag/uniquenetwork/unique-sdk?style=flat-square)
[![stability-alpha](https://img.shields.io/badge/stability-alpha-f4d03f.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#alpha)
</div>

# SDK methods list

# Table of Contents

- [Token methods](#token-methods)
- [Collection methods](#collection-methods)



## Token methods

### TX methods
| Method                      | Description                                                                                                                                                                                                                                                                                                    | Status | Folder                                             |
|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------------------------------------------------|
| addToAllowList              |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| approve                     |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| burnFrom                    |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| burnItem                    |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| confirmSponsorship          |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| createItem                  |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| createMultipleItems         |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| createMultipleItemsEx       |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| deleteTokenProperties       |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| nestToken                   | Nesting is a process of forming a structural relationship between two NFTs that form a parent-child relationship in a tree structure. Such a relationship is formed by forwarding token A2 to the address of token A1 by which A2 becomes a child of token A1 (conversely, token A1 becomes the parent of A2). | Ready  | [Link](./packages/sdk/tokens/methods/nest-token)   |
| removeFromAllowList         |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| repartition                 |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| setTokenProperties          |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| setTokenPropertyPermissions |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| setTransfersEnabledFlag     |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| transfer                    |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| transferFrom                |                                                                                                                                                                                                                                                                                                                |        |                                                    |
| unnestToken                 | Nesting is a process of forming a structural relationship between two NFTs that form a parent-child relationship in a tree structure. Such a relationship is formed by forwarding token A2 to the address of token A1 by which A2 becomes a child of token A1 (conversely, token A1 becomes the parent of A2). | Ready  | [Link](./packages/sdk/tokens/methods/unnest-token) |

### RPC methods
| Method              | Description                                      | Status | Folder                                                    |
|---------------------|--------------------------------------------------|--------|-----------------------------------------------------------|
| accountBalance      |                                                  |        |                                                           |
| accountTokens       |                                                  |        |                                                           |
| adminlist           |                                                  |        |                                                           |
| allowance           |                                                  |        |                                                           |
| allowed             |                                                  |        |                                                           |
| allowlist           |                                                  |        |                                                           |
| balance             |                                                  |        |                                                           |
| constMetadata       |                                                  |        |                                                           |
| lastTokenId         |                                                  |        |                                                           |
| nextSponsored       |                                                  |        |                                                           |
| propertyPermissions |                                                  |        |                                                           |
| tokenChildren       | Gets array of nested tokens                      | Ready  | [Link](./packages/sdk/tokens/methods/token-children)      | 
| tokenData           |                                                  |        |                                                           |
| tokenExists         |                                                  |        |                                                           |
| tokenOwner          |                                                  |        |                                                           |
| tokenParent         | Returns info about token parent                  | Ready  | [Link](./packages/sdk/tokens/methods/token-parent)        |
| tokenProperties     |                                                  |        |                                                           |
| topmostTokenOwner   | Returns substrate address of topmost token owner | Ready  | [Link](./packages/sdk/tokens/methods/topmost-token-owner) |
| totalSupply         |                                                  |        |                                                           |
| variableMetadata    |                                                  |        |                                                           |

---

## Collection methods

### TX methods

| Method                      | Description | Status | Folder                                                      |
|-----------------------------|-------------|--------|-------------------------------------------------------------|
| addCollectionAdmin          |             |        |                                                             |
| changeCollectionOwner       |             |        |                                                             |
| createCollection            |             |        |                                                             |
| createCollectionEx          | TBD         | Ready  | [Link](./packages/sdk/tokens/methods/create-collection-ex)  |
| deleteCollectionProperties  |             |        |                                                             |
| destroyCollection           |             |        |                                                             |
| removeCollectionAdmin       |             |        |                                                             |
| removeCollectionSponsor     |             |        |                                                             |
| setCollectionLimits         | TBD         | Ready  | [Link](./packages/sdk/tokens/methods/set-collection-limits) |
| setCollectionPermissions    |             |        |                                                             |
| setCollectionProperties     |             |        |                                                             |
| setCollectionSponsor        |             |        |                                                             |

### RPC methods
| Method                    | Description                                                                                                                                                                                                                                                                                                                                                                                                               | Status | Folder                                                            |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|-------------------------------------------------------------------|
| collectionById            | Returns collection info in human-readable format                                                                                                                                                                                                                                                                                                                                                                          | Ready  | [Link](./packages/sdk/tokens/methods/collection-by-id)            |
| collectionProperties      |                                                                                                                                                                                                                                                                                                                                                                                                                           |        |                                                                   |
| collectionStats           |                                                                                                                                                                                                                                                                                                                                                                                                                           |        |                                                                   |
| collectionTokens          |                                                                                                                                                                                                                                                                                                                                                                                                                           |        |                                                                   |
| effectiveCollectionLimits | By default, the collection limit is not set (their value is null). This limit value can be seen when requesting a collection using Get collection by ID method. If the limit is not set by the user, then the default limit is actually applied to the collection. The values of the limits actually applied to the collection (default and user-set) can be obtained using Get effective limits by collection ID method. | Ready  | [Link](./packages/sdk/tokens/methods/effective-collection-limits) |

