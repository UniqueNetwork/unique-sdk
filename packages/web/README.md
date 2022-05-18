[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
[![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/)
![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/marketplace-frontend?style=flat-square)
![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-marketplace-frontend?style=flat-square)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)



_так же расписать что концептульно апи собирает экстринсик, клиент должен его подписать и отправить обратно_ - ждем пояснений

_туду: будет вариант самоподписывающихся транзакций если мы передадим сид в апи_ - ждем

## Table of Contents

- [Prerequisites](#)
  - [Instsall/Easy start](#)
        - [Docker setup](#)
    - [Environment Variables](#)
       - [Production](#)
       - [Staging](#)
       - [Test](#)


- [Unique SDK HTTP API Methods:](#)
  - [Main Methods](#)
    - [Extrinsic build](#)
    - [Extrinsic submit](#)
  - [Additional Methods](#)
    - [Сhain](#)
    - [Balance](#)
    - [Collection](#)
    - [Token](#)
  - [Ошибки](#)


  


# SDK Deployment - Getting Started Guide

## Prerequisites

>  * OS: Ubuntu 18.04 or 20.04
>  * docker CE 20.10 or up
>  * docker-compose 1.25 or up
>  * git
>  * Google Chrome Browser
> * connected to wss://ws-quartz.unique.network


## Instsall/Easy start
### Docker setup

https://hub.docker.com/r/uniquenetwork/web 

Start container with command 

```shell
docker run -p 3000:3000 -e CHAIN_WS_URL=wss://ws-quartz.unique.network uniquenetwork/web:latest
```

... or via docker-compose (.yml)

```
version: '3'

services:
  unique-web:
    image: uniquenetwork/web:latest
    ports:
      - '3000:3000'
    environment:
      - CHAIN_WS_URL=wss://ws-quartz.unique.network
```

Explore available methods on
```
http://localhost:3000/swagger/
```

### Environment Variables

#### Production
```
CHAIN_WS_URL=wss://ws-quartz.unique.network
```
#### Staging
```
CHAIN_WS_URL=wss://quartz.unique.network
```

```
CHAIN_WS_URL=wss://eu-ws-quartz.unique.network
```

```
CHAIN_WS_URL=wss://us-ws-quartz.unique.network
```

#### Test
```
CHAIN_WS_URL=wss://testnet2.unique.network
```



# Methods

## Main Methods

### POST /extrinsic/build

Назначение метода: *******

#### Request
Curl example
```
curl -X 'POST' \
  'https://web.uniquenetwork.dev/extrinsic/build' \
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

Request body (Example Value, Schema)
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

Parameters - No parameters


#### Response
Успешный ответ - 201 OK и содержит тело:

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

Каждый элемент коллекции содержит следующую информацию:

название |  комментарий
---------|------------
signerPayloadHex | *************
signerPayloadJSON | ***************
address | ********************
blockHash | *******************
blockNumber | ***************
era | ***************
genesisHash | ***************
method | ***************
nonce | ***************
specVersion | ***************
transactionVersion | ***************
signedExtensions | ***************
version | ***************
address | ***************
data | ***************
type | ***************


### POST /extrinsic/submit

Назначение метода: *******

#### Request
Curl example
<details> <summary> JSON </summary>

```json
curl -X 'POST' \
  'https://web.uniquenetwork.dev/extrinsic/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
   "signerPayloadJSON": </summary> {
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

Request body (Example Value, Schema)

<details> <summary> JSON </summary>

```json
{
"signature": "string",
<details>
  <summary>"signatureType": "sr25519",  </summary>
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
</details>

Parameters - No parameters

#### Response
Успешный ответ - 201 OK и содержит тело:

```json
{
"hash": "string"
}
```

Каждый элемент коллекции содержит следующую информацию:

название | комментарий
---------|------------
signerPayloadHex | *********
signerPayloadJSON | *********



## Additional Methods

### Сhain
Назначение метода:*******


#### Request

Curl example
```
curl -X 'GET' \
  'https://web.uniquenetwork.dev/chain/properties' \
  -H 'accept: application/json'
```

Parameters - No parameters


#### Response

1) Успешный ответ - 200 OK и содержит тело:

```json
{
  "SS58Prefix": 255,
  "decimals": 18,
  "token": "QTZ",
  "wsUrl": "wss://ws-quartz.unique.network"
}
```

2) Успешный ответ - default и содержит тело:

```json
{
"SS58Prefix": 255,
"decimals": 18,
"token": "QTZ",
"wsUrl": "wss://ws-quartz.unique.network"
}
```

Каждый элемент коллекции содержит следующую информацию:

название | комментарий
---------|------------
SS58Prefix | префикс чейна
decimals   | предел коичества знаков после запятой
token      | валюта токена
wsUrl      | url блокчейна


### Balance

Назначение метода:*******

#### GET /balance
#### Request

Curl example
```
curl -X 'GET' \
  'https://web.uniquenetwork.dev/balance?address=yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm' \
  -H 'accept: application/json'
```

Parameters
Параметр | тип | комментарий
---------|-----|------------
address  | string |

#### Response

Успешный ответ - 200 OK и содержит тело:

```json
{
"amount": "411348197000000000000",
"formatted": "411.3481 QTZ"
}
```

Каждый элемент коллекции содержит следующую информацию:

название | комментарий
---------|--------------
amount | ***********
formatted | **********

#### POST /balance/transfer

#### Request
Curl example

```
curl -X 'POST' \
  'https://web.uniquenetwork.dev/balance/transfer' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "destination": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "amount": 0.01
}'
```

Request body (Example Value, Schema)
```
{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "destination": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "amount": 0.01
}
```
Parameters - No parameters

#### Response

Успешный ответ - 201 OK и содержит тело:

```json
{
<details>  
     <summary>"signerPayloadJSON":  </summary> {
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
}</details>
```

Каждый элемент коллекции содержит следующую информацию:


название | комментарий
---------|------------
signerPayloadJSON | *************
address | *************
blockHash | *************
blockNumber | *************
era | *************
genesisHash | *************
method | *************
nonce | *************
specVersion | *************
tip | *************
transactionVersion | *************
signedExtensions | *************
version | *************
signerPayloadRaw | *************
address | *************
data |*************
type | *************
signerPayloadHex | *************

### Collection

Назначение метода: *******

#### GET /collection
#### Request
Curl example

```
curl -X 'GET' \
  'https://web.uniquenetwork.dev/collection?collectionId=1' \
  -H 'accept: application/json'
```

Parameters
Параметр | комментарий
---------|------------
collectionId  | *************

#### Response
Успешный ответ - 200 OK и содержит тело:
```
{
  <details>
   <summary>"mode": "Nft", </summary>
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
}</details>
```
Каждый элемент коллекции содержит следующую информацию:

название |  комментарий
---------|--------------
mode | ***********
access | ***********
schemaVersion | ***********
constOnChainSchema | ***********
nested | ***********
onChainMetaData |***********
NFTMeta | ***********
fields | ***********
ipfsJson | ***********
id | ***********
rule | ***********
type | ***********
variableOnChainSchema | ***********
id | ***********
description | ***********
limits | ***********
accountTokenOwnershipLimit | ***********
sponsoredDataSize | ***********
sponsoredDataRateLimit |***********
tokenLimit | ***********
sponsorTransferTimeout | ***********
sponsorApproveTimeout | ***********
ownerCanTransfer | ***********
ownerCanDestroy | ***********
transfersEnabled | ***********
metaUpdatePermission | ***********
mintMode | ***********
name | ***********
offchainSchema | ***********
owner | ***********
sponsorship | ***********
address | ***********
isConfirmed | ***********
tokenPrefix | ***********


#### POST /collection
#### Request
Curl example

```
<details> <summary>curl -X 'POST' \ </summary>
  'https://web.uniquenetwork.dev/collection' \
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
}'</details>
```

Request body (Example Value, Schema)
```
{
   <details><summary>"mode": "Nft", </summary>
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
}</details>
```

Parameters - No parameters

#### Response
Успешный ответ - 201 OK и содержит тело:
```
{
  <details> <summary>"signerPayloadHex": "string",</summary>
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
}</details>
```
Каждый элемент коллекции содержит следующую информацию:

название |  комментарий
---------|-------------
signerPayloadHex | ***********
signerPayloadJSON | ***********
address | ***********
blockHash | ***********
blockNumber | ***********
era | ***********
genesisHash | ***********
method | ***********
nonce | ***********
specVersion | ***********
tip | ***********
transactionVersion | ***********
signedExtensions | ***********
version | ***********
signerPayloadRaw | ***********
address | ***********
data | ***********
type | ***********




#### DELETE /collection
#### Request
Curl example
```
curl -X 'DELETE' \
  'https://web.uniquenetwork.dev/collection?collectionId=1&address=yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz7867' \
  -H 'accept: application/json'
```

Request body (Example Value, Schema)
```
{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "collectionId": 0
}
```

Parameters - No parameters


#### Response
Успешный ответ - 200 OK и содержит тело:
```
{
  <details><summary>"signerPayloadHex": "string",</summary>
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
}</details>
```
Каждый элемент коллекции содержит следующую информацию:

название | комментарий
---------|-------------
signerPayloadHex | *************
signerPayloadJSON | ***********
address | ***********
blockHash | ***********
blockNumber | ***********
era | ***********
genesisHash | ***********
method | ***********
nonce | ***********
specVersion | ***********
tip | ***********
transactionVersion | ***********
signedExtensions | ***********
version | ***********
signerPayloadRaw | ***********
address | ***********
data | ***********
type | ***********



#### PATCH /collection
#### Request
Curl example
```
curl -X 'PATCH' \
  'https://web.uniquenetwork.dev/collection/transfer' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "collectionId": 0,
  "from": "string",
  "to": "string"
}'
```

Request body (Example Value, Schema)
```
{
  "collectionId": 0,
  "from": "string",
  "to": "string"
}
```

Parameters - No parameters

#### Response
Успешный ответ - 200 OK и содержит тело:
```
{
 <details>  <summary>"signerPayloadHex": "string", </summary>
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
}</details>
```
Каждый элемент коллекции содержит следующую информацию:

название | комментарий
---------|------------
signerPayloadHex | ***********
signerPayloadJSON | ***********
address | ***********
blockHash | ***********
blockNumber | ***********
era | ***********
genesisHash | ***********
method | ***********
nonce | ***********
specVersion | ***********
tip | ***********
transactionVersion | ***********
signedExtensions | ***********
version | ***********
signerPayloadRaw | ***********
address | ***********
data | ***********
type | ***********



### Token
#### GET /token
#### Request
Curl example
```
curl -X 'GET' \
  'https://web.uniquenetwork.dev/token?collectionId=1&tokenId=1' \
  -H 'accept: application/json'
```

Parameters
Параметр | комментарий
---------|------------
collectionId  | ***********
tokenId   | ***********

#### Response
Успешный ответ - 200 OK и содержит тело:
```
{}
```

#### POST /token
#### Request
Curl example
```
curl -X 'POST' \
  'https://web.uniquenetwork.dev/token' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "collectionId": 0,
  "address": "string",
  "constData": {}
}'
```

Request body (Example Value, Schema)
```
{
  "address": "string",
  "collectionId": 0,
  "constData": {}
}
```

Parameters - No parameters

#### Response
Успешный ответ - 201 OK и содержит тело:

```
{
 <details>  <summary>"signerPayloadHex": "string", </summary>
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
}</details>
```

название | комментарий
---------|------------
mode | ***********
nested | ***********
onChainMetaData | ***********
NFTMeta | ***********
fields | ***********
ipfsJson | ***********
id | ***********
rule | ***********
type | ***********
variableOnChainSchema | ***********
id | ***********
description | ***********
limits | ***********
accountTokenOwnershipLimit | ***********
owner | ***********
sponsorship | ***********
address | ***********
isConfirmed | ***********
tokenPrefix | ***********



#### DELETE /token
#### Request
Curl example
```
curl -X 'DELETE' \
  'https://web.uniquenetwork.dev/token?collectionId=1&tokenId=1&address=yGCyN3eydMkze4EPtz59Tn7obwbU32438FRdemTaLwm' \
  -H 'accept: application/json'
```

Request body (Example Value, Schema)
```
{
  "address": "string",
  "collectionId": 0,
  "tokenId": 0
}
```

Parameters - No parameters

#### Response
Успешный ответ - 200 OK и содержит тело:

```
{
 <details>  <summary>"signerPayloadHex": "string", </summary>
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
}</details>
```

название | комментарий
---------|------------
mode | ***********
nested | ***********
onChainMetaData | ***********
NFTMeta | ***********
fields | ***********
ipfsJson | ***********
id | ***********
rule | ***********
type | ***********
variableOnChainSchema | ***********
id | ***********
description | ***********
limits | ***********
accountTokenOwnershipLimit | ***********
owner | ***********
sponsorship | ***********
address | ***********
isConfirmed | ***********
tokenPrefix | ***********



#### PATCH /token
#### Request
Curl example
```
curl -X 'PATCH' \
  'https://web.uniquenetwork.dev/token/transfer' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "collectionId": 1,
  "tokenId": 1,
  "from": "string",
  "to": "string"
}'
```

Request body (Example Value, Schema)
```
{
  "collectionId": 0,
  "from": "string",
  "to": "string",
  "tokenId": 0
}
```

Parameters - No parameters

#### Response
Успешный ответ - 200 OK и содержит тело:

```
{
 <details>  <summary>"signerPayloadHex": "string", </summary>
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
}</details>
```

название | комментарий
---------|------------
mode | ***********
nested | ***********
onChainMetaData | ***********
NFTMeta | ***********
fields | ***********
ipfsJson | ***********
id | ***********
rule | ***********
type | ***********
variableOnChainSchema | ***********
id | ***********
description | ***********
limits | ***********
accountTokenOwnershipLimit | ***********
owner | ***********
sponsorship | ***********
address | ***********
isConfirmed | ***********
tokenPrefix | ***********


#### Ошибки

***** - ошибка(?)
