<div align="center">
    <img width="400px" src="../../../doc/logo-white.svg" alt="Unique Network">

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
| Method                      | Description                                                                                                                           | Status | Folder                         |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------|--------|--------------------------------|
| createToken                 | TBD                                                                                                                                   | Ready  | [Link](./methods/create-token) |
| nestToken                   | Nesting is a process of forming a structural relationship between two NFTs that form a parent-child relationship in a tree structure. | Ready  | [Link](./methods/nest-token)   |
| unnestToken                 | Nesting is a process of forming a structural relationship between two NFTs that form a parent-child relationship in a tree structure. | Ready  | [Link](./methods/unnest-token) |

### RPC methods
| Method              | Description                                      | Status | Folder                                |
|---------------------|--------------------------------------------------|--------|---------------------------------------|
| tokenByID           | Returns token info and attributes                | Ready  | [Link](./methods/token-by-id)         | 
| tokenChildren       | Gets array of nested tokens                      | Ready  | [Link](./methods/token-children)      | 
| tokenParent         | Returns info about token parent                  | Ready  | [Link](./methods/token-parent)        |
| topmostTokenOwner   | Returns substrate address of topmost token owner | Ready  | [Link](./methods/topmost-token-owner) |

---

## Collection methods

### TX methods

| Method                     | Description | Status             | Folder                                     |
|----------------------------|-------------|--------------------|--------------------------------------------|
| createCollectionExNew      | TBD         | Ready              | [Link](./methods/create-collection-ex-new) |
| createCollectionEx         | TBD         | Ready (deprecated) | [Link](./methods/create-collection-ex)     |
| setCollectionLimits        | TBD         | Ready              | [Link](./methods/set-collection-limits)    |


### RPC methods
| Method                    | Description                                                                                                                                            | Status             | Folder                                        |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|-----------------------------------------------|
| collectionByIdNew         | Returns collection info in human-readable format (with Unique schema)                                                                                  | Ready              | [Link](./methods/collection-by-id-new)        |
| collectionById            | Returns collection info in human-readable format                                                                                                       | Ready (deprecated) | [Link](./methods/collection-by-id)            |
| getStats                  | Returns blockchain collection statistics                                                                                                               | Ready              | [Link](./methods/get-stats)                   |
| effectiveCollectionLimits | The values of the limits actually applied to the collection (default and user-set) can be obtained using Get effective limits by collection ID method. | Ready              | [Link](./methods/effective-collection-limits) |

