[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
[![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/)
![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/marketplace-frontend?style=flat-square)
![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-marketplace-frontend?style=flat-square)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)


Extrasic is a request to change data in the blockchain.

https://docs.substrate.io/v3/concepts/extrinsics/

https://polkadot.js.org/docs/substrate/extrinsics/

To make changes to the blockchain, it is necessary to form a request (extrinsic) with certain parameters, which consists of 3 parts:
1) Blockchain section, functional
2) Section Method
3) Array of arguments

Once an extrusion has been generated, it must be signed in order for the chain to complete the requested changes.


## Table of Contents

- [Install/Easy start](#installeasy-start)
    - [Choose install approach](#choose-install-approach)
      - [Docker](#docker-setup)
      - [Git](#git)
      - [Use public endpoints](#use-public-endpoints)
    - [Environment Variables](#environment-variables)
    - [Swagger](#swagger)


- [Unique SDK HTTP API Methods:](#methods)
  - [Main Methods](#main-methods)
    - [Extrinsic build](#post-extrinsicbuild)
    - [Extrinsic sign](#post-extrinsicsign)
    - [Extrinsic verify-sign](#post-extrinsicverify-sign)
    - [Extrinsic submit](#post-extrinsicsubmit)
  - [Additional Methods](#additional-methods)
    - [Сhain](#get-chainproperties)
    - [Balance](#get-balance)
    - [Collection](#get-collection)
    - [Token](#get-token)

# SDK Deployment - Getting Started Guide


## Install/Easy start

### Choose install approach

#### Docker setup

```bash
docker run -p 3000:3000 -e CHAIN_WS_URL=wss://quartz.unique.network uniquenetwork/web:latest
```

<a href="https://hub.docker.com/r/uniquenetwork/web" target="_blank">See hub.docker.com page</a>

#### Git

```git
git clone https://github.com/UniqueNetwork/unique-sdk
cd unique-sdk
npm install
npm run build:web
npm start
```

#### Use public endpoints

You can use public endpoints for access Unique Web:

##### Opal
```
https://web-opal.unique.network
```

##### Quartz
```
https://web-quartz.unique.network
```

### Environment Variables

#### Required
```bash
CHAIN_WS_URL=wss://quartz.unique.network
```

<a href="https://docs.unique.network/unique-and-quartz-wiki/build/get-started/testnet-and-mainnet" target="_blank">See official Unique Network documentation</a>

#### Optional

##### Use SIGNER_SEED or SIGNER_URI for [Sign](#post-extrinsicsign) method
```bash
SIGNER_SEED=type mnemonic here
SIGNER_URI=//Alice
```

##### Port (default 3000)
```bash
PORT=3000
```

##### IPFS Gateway
```bash
IPFS_GATEWAY_URL=https://ipfs.unique.network/ipfs/
```

### Swagger
```
https://web-quartz.unique.network/swagger
```

# Methods

## Main Methods

### POST /extrinsic/build

Build and returns unsigned extrinsic.
Next you must sign it and send with sign
to [/extrinsic/submit](#post-extrinsicsubmit) method
to apply the blockchain change.   

#### Request body

```json
{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "section": "balances",
  "method": "transfer",
  "args": [
    "yGEYS1E6fu9YtECXbMFRf1faXRakk3XDLuD1wPzYb4oRWwRJK",
    100000000
  ],
  "era": 64,
  "isImmortal": false
}
```

<details>
 <summary>▶ CURL Example</summary>
  
  ```bash
  curl -X 'POST' \
    'https://web-quartz.unique.network/extrinsic/build' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "section": "balances",
    "method": "transfer",
    "args": [
      "yGEYS1E6fu9YtECXbMFRf1faXRakk3XDLuD1wPzYb4oRWwRJK",
      100000000
    ],
    "era": 64,
    "isImmortal": false
  }'
  ```

</details>

#### Response
<details>
  <summary>▶ Http Status 200</summary>

  ```json
  {
    "signerPayloadHex": "string",
    "signerPayloadJSON": {
      "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
      "blockHash": "string",
      "blockNumber": "string",
      "era": "string",
      "genesisHash": "string",
      "method": "string",
      "nonce": "string",
      "specVersion": "string",
      "tip": "string",
      "transactionVersion": "string",
      "signedExtensions": [
        "string"
      ],
        "version": 0
    },
    "signerPayloadRaw": {
      "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
      "data": "string",
      "type": {}
    }
  }
  ```

  ##### Unsigned Extrinsic fields:
  
  field |  comment
  ---------|------------
  signerPayloadHex | string
  signerPayloadJSON | string
  address | string
  blockHash | string
  blockNumber | string
  era | string
  genesisHash | string
  method | string
  nonce | string
  specVersion | string
  transactionVersion | string
  signedExtensions | string
  version | string
  address | string
  data | string
  type | string

</details>


### POST /extrinsic/sign

Purpose of the method: sign an extrusion

#### Request body

```json
{
  "signerPayloadHex": "string"
}
```

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'POST' \
  'https://web-quartz.unique.network/extrinsic/sign' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "signerPayloadHex": "string"
  }'
```
</details>

#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signature": "string"
}
```

  ##### Unsigned Extrinsic fields:

field |  comment
---------|------------
signature | string

</details>

### POST /extrinsic/verify-sign

Purpose of the method: check the signature of the extrusion

#### Request body 

```json
{
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signature": "string",
  "signatureType": "sr25519"
}
```

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'POST' \
  'https://web-quartz.unique.network/extrinsic/verify-sign' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signature": "string",
  "signatureType": "sr25519"
}'
```
</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

  ##### Unsigned Extrinsic fields:

field |  comment
---------|------------
statusCode | string
message | string


</details>

### POST /extrinsic/submit

Purpose of the method: send the signed extrusion to the chain

#### Request body

```json
{
  "signature": "string",
  "signatureType": "sr25519",
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  }
}
```

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'POST' \
  'https://web-quartz.unique.network/extrinsic/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
   "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signature": "string",
  "signatureType": "sr25519"
}'
```
</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "hash": "string"
}
```

  ##### Unsigned Extrinsic fields:

field |  comment
---------|------------
signerPayloadHex | string
signerPayloadJSON | string

</details>


  
## Additional Methods

### GET /chain/properties

Purpose of the method: requests the service fields required to work with the blockchain


#### Request body
Parameters - No parameters


<details>
 <summary>▶ CURL Example</summary>
  
```bash
curl -X 'GET' \
  'https://web-quartz.unique.network/chain/properties' \
  -H 'accept: application/json'
```
  
</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "SS58Prefix": 255,
  "decimals": 18,
  "token": "QTZ",
  "wsUrl": "wss://quartz.unique.network"
}
```
  ##### Unsigned Extrinsic fields:

field |  comment
---------|------------
SS58Prefix | string
decimals   | string
token      | string
wsUrl      | string


</details>
 

### Balance

#### GET /balance

Purpose of the method: returns the account balance in formatted and unformatted form

#### Request body
Parameters

field |  comment
---------|-------------
address  | string

<details>
 <summary>▶ CURL Example</summary>
  
```bash
curl -X 'GET' \
  'https://web-quartz.unique.network/balance?address=yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm' \
  -H 'accept: application/json'
```
  
</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "amount": "411348197000000000000",
  "formatted": "411.3481 QTZ"
}
```

  ##### Unsigned Extrinsic fields:

field |  comment
---------|--------------
amount | string
formatted | string

</details>

#### POST /balance/transfer

Purpose of the method: creates an unsigned extrinsic for a transfer of a certain amount of coins

#### Request body

```json
{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "destination": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "amount": 0.01
}
```

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'POST' \
  'https://web-quartz.unique.network/balance/transfer' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "destination": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "amount": 0.01
}'
```

</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  
    "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": "bytes"
  },
  "signerPayloadHex": "string"
}
```

  ##### Unsigned Extrinsic fields:


field |  comment
---------|------------
signerPayloadJSON | string
address | string
blockHash | string
blockNumber | string
era | string
genesisHash | string
method | string
nonce | string
specVersion | string
tip | string
transactionVersion | string
signedExtensions | string
version | string
signerPayloadRaw | string
address | string
data | string
type | string
signerPayloadHex | string

</details>


### Collection

#### GET /collection

Purpose of the method: returns information about the collection by id

#### Request body
Query Parameters

```
- collectionId - id of collection
```

<details>
 <summary>▶ CURL Example</summary>


```bash
curl -X 'GET' \
  'https://web-quartz.unique.network/collection?collectionId=1' \
  -H 'accept: application/json'
```

</details>
  
#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  
  "mode": "Nft",
  "access": "Normal",
  "schemaVersion": "ImageURL",
  "constOnChainSchema": {
    "nested": {
      "onChainMetaData": {
        "nested": {
          "NFTMeta": {
            "fields": {
              "ipfsJson": {
                "id": 1,
                "rule": "required",
                "type": "string"
              }
            }
          }
        }
      }
    }
  },
  "variableOnChainSchema": {},
  "id": 0,
  "description": "string",
  "limits": {
    "accountTokenOwnershipLimit": 0,
    "sponsoredDataSize": 0,
    "sponsoredDataRateLimit": 0,
    "tokenLimit": 0,
    "sponsorTransferTimeout": 0,
    "sponsorApproveTimeout": 0,
    "ownerCanTransfer": true,
    "ownerCanDestroy": true,
    "transfersEnabled": true
  },
  "metaUpdatePermission": {},
  "mintMode": true,
  "name": "string",
  "offchainSchema": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png",
  "owner": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "sponsorship": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "isConfirmed": true
  },
  "tokenPrefix": "string"
}
```


  ##### Unsigned Extrinsic fields:

field |  comment
---------|--------------
mode | string
access | string
schemaVersion | string
constOnChainSchema | string
nested | string
onChainMetaData string
NFTMeta | string
fields | string
ipfsJson | string
id | string
rule | string
type | string
variableOnChainSchema | string
id | string
description | string
limits | string
accountTokenOwnershipLimit | string
sponsoredDataSize | string
sponsoredDataRateLimit string
tokenLimit | string
sponsorTransferTimeout | string
sponsorApproveTimeout | string
ownerCanTransfer | string
ownerCanDestroy | string
transfersEnabled | string
metaUpdatePermission | string
mintMode | string
name | string
offchainSchema | string
owner | string
sponsorship | string
address | string
isConfirmed | string
tokenPrefix | string

</details>


#### POST /collection

Purpose of the method: generates an unsigned extrusion to create a collection with certain parameters

#### Request body

```json
{
  "mode": "Nft",
  "access": "Normal",
  "schemaVersion": "ImageURL",
  "constOnChainSchema": {
    "nested": {
      "onChainMetaData": {
        "nested": {
          "NFTMeta": {
            "fields": {
              "ipfsJson": {
                "id": 1,
                "rule": "required",
                "type": "string"
              }
            }
          }
        }
      }
    }
  },
  "metaUpdatePermission": "ItemOwner",
  "variableOnChainSchema": {},
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "name": "Sample collection name",
  "description": "sample collection description",
  "tokenPrefix": "TEST",
  "limits": {
    "accountTokenOwnershipLimit": 0,
    "sponsoredDataSize": 0,
    "sponsoredDataRateLimit": 0,
    "tokenLimit": 0,
    "sponsorTransferTimeout": 0,
    "sponsorApproveTimeout": 0,
    "ownerCanTransfer": true,
    "ownerCanDestroy": true,
    "transfersEnabled": true
  },
  "mintMode": true,
  "offchainSchema": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png",
  "sponsorship": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "isConfirmed": true
  }
}
```


<details>
 <summary>▶ CURL Example</summary>

```bash
   curl -X 'POST' \ 
  'https://web-quartz.unique.network/collection' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "mode": "Nft",
  "access": "Normal",
  "schemaVersion": "ImageURL",
  "name": "Sample collection name",
  "description": "sample collection description",
  "tokenPrefix": "TEST",
  "mintMode": true,
  "offchainSchema": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png",
  "sponsorship": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "isConfirmed": true
  },
  "limits": {
    "accountTokenOwnershipLimit": 0,
    "sponsoredDataSize": 0,
    "sponsoredDataRateLimit": 0,
    "tokenLimit": 0,
    "sponsorTransferTimeout": 0,
    "sponsorApproveTimeout": 0,
    "ownerCanTransfer": true,
    "ownerCanDestroy": true,
    "transfersEnabled": true
  },
  "constOnChainSchema": {
    "nested": {
      "onChainMetaData": {
        "nested": {
          "NFTMeta": {
            "fields": {
              "ipfsJson": {
                "id": 1,
                "rule": "required",
                "type": "string"
              }
            }
          }
        }
      }
    }
  },
  "variableOnChainSchema": {},
  "metaUpdatePermission": "ItemOwner",
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm"
}'
```
</details>



#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signerPayloadHex": "string",
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": {}
  }
}
```


  ##### Unsigned Extrinsic fields:

field |  comment
---------|-------------
signerPayloadHex | string
signerPayloadJSON | string
address | string
blockHash | string
blockNumber | string
era | string
genesisHash | string
method | string
nonce | string
specVersion | string
tip | string
transactionVersion | string
signedExtensions | string
version | string
signerPayloadRaw | string
address | string
data | string
type | string

</details>


#### DELETE /collection

Purpose of the method: generates an unsigned extrusion to delete the selected collection

#### Request body
```json
{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "collectionId": 0
}
```
  

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'DELETE' \
  'https://web-quartz.unique.network/collection?collectionId=1&address=yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz7867' \
  -H 'accept: application/json'
```

</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signerPayloadHex": "string",
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": {}
  }
}
```


  ##### Unsigned Extrinsic fields:

field |  comment
---------|-------------
signerPayloadHex | string
signerPayloadJSON | string
address | string
blockHash | string
blockNumber | string
era | string
genesisHash | string
method | string
nonce | string
specVersion | string
tip | string
transactionVersion | string
signedExtensions | string
version | string
signerPayloadRaw | string
address | string
data | string
type | string


</details>
  

#### PATCH /collection/transfer

Purpose of the method: generates an unsigned extrinsic for transferring rights to collections

#### Request body
  
```json
{
  "collectionId": 0,
  "from": "string",
  "to": "string"
}
```
  

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'PATCH' \
  'https://web-quartz.unique.network/collection/transfer' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "collectionId": 0,
  "from": "string",
  "to": "string"
}'
```

</details>
  

#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
 "signerPayloadHex": "string",
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": {}
  }
}
```


  ##### Unsigned Extrinsic fields:

field |  comment
---------|------------
signerPayloadHex | string
signerPayloadJSON | string
address | string
blockHash | string
blockNumber | string
era | string
genesisHash | string
method | string
nonce | string
specVersion | string
tip | string
transactionVersion | string
signedExtensions | string
version | string
signerPayloadRaw | string
address | string
data | string
type | string

</details>

### Token
#### GET /token

Purpose of the method: returns information about the token by the id of the collection and token

#### Request body
Parameters

field |  comment
---------|------------
collectionId  | string
tokenId   | string


<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'GET' \
  'https://web-quartz.unique.network/token?collectionId=1&tokenId=1' \
  -H 'accept: application/json'
```
  
</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "id": 1,
  "owner": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "collectionId": 1,
  "constData": {
    "ipfsJson": "{\"ipfs\":\"QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb\",\"type\":\"image\"}",
    "gender": "Male",
    "traits": [
      "TEETH_SMILE",
      "UP_HAIR"
    ]
  },
  "url": "https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png"
}
```
</details>

#### POST /token

Purpose of the method: creates an unsigned extrinsic to create a token inside the collection

#### Request body

```json
{
  "address": "string",
  "collectionId": 0,
  "constData": {}
}
```

<details>
 <summary>▶ CURL Example</summary>
  
```bash
curl -X 'POST' \
  'https://web-quartz.unique.network/token' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "collectionId": 0,
  "address": "string",
  "constData": {}
}'
```

</details>
  

#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signerPayloadHex": "string",
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": {}
  }
}
```


  ##### Unsigned Extrinsic fields:

field |  comment
---------|------------
mode | string
nested | string
onChainMetaData | string
NFTMeta | string
fields | string
ipfsJson | string
id | string
rule | string
type | string
variableOnChainSchema | string
id | string
description | string
limits | string
accountTokenOwnershipLimit | string
owner | string
sponsorship | string
address | string
isConfirmed | string
tokenPrefix | string

</details>


#### DELETE /token

Purpose of the method: generates an unsigned extrusion to delete the selected token

#### Request body

```json
{
  "address": "string",
  "collectionId": 0,
  "tokenId": 0
}
```

<details>
 <summary>▶ CURL Example</summary>

```bash
curl -X 'DELETE' \
  'https://web-quartz.unique.network/token?collectionId=1&tokenId=1&address=yGCyN3eydMkze4EPtz59Tn7obwbU32438FRdemTaLwm' \
  -H 'accept: application/json'
```

</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signerPayloadHex": "string",
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": {}
  }
}
```

  ##### Unsigned Extrinsic fields:

field |  comment
---------|------------
mode | string
nested | string
onChainMetaData | string
NFTMeta | string
fields | string
ipfsJson | string
id | string
rule | string
type | string
variableOnChainSchema | string
id | string
description | string
limits | string
accountTokenOwnershipLimit | string
owner | string
sponsorship | string
address | string
isConfirmed | string
tokenPrefix | string

</details>


#### PATCH /token

Purpose of the method: generates an unsigned extrinsic for transferring rights to a token

#### Request body

```json
{
  "collectionId": 0,
  "from": "string",
  "to": "string",
  "tokenId": 0
}
```

<details>
 <summary>▶ CURL Example</summary>
  
```bash
curl -X 'PATCH' \
  'https://web-quartz.unique.network/token/transfer' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "collectionId": 1,
  "tokenId": 1,
  "from": "string",
  "to": "string"
}'
```
</details>


#### Response
<details>
  <summary>▶ Http Status 200</summary>

```json
{
  "signerPayloadHex": "string",
  "signerPayloadJSON": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "blockHash": "string",
    "blockNumber": "string",
    "era": "string",
    "genesisHash": "string",
    "method": "string",
    "nonce": "string",
    "specVersion": "string",
    "tip": "string",
    "transactionVersion": "string",
    "signedExtensions": [
      "string"
    ],
    "version": 0
  },
  "signerPayloadRaw": {
    "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
    "data": "string",
    "type": {}
  }
}
```

  ##### Unsigned Extrinsic fields:

field |  comment
---------|------------
mode | string
nested | string
onChainMetaData | string
NFTMeta | string
fields | string
ipfsJson | string
id | string
rule | string
type | string
variableOnChainSchema | string
id | string
description | string
limits | string
accountTokenOwnershipLimit | string
owner | string
sponsorship | string
address | string
isConfirmed | string
tokenPrefix | string

</details>
