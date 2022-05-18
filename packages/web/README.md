[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
[![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/)
![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/marketplace-frontend?style=flat-square)
![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-marketplace-frontend?style=flat-square)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)



_так же расписать что концептульно апи собирает экстринсик, клиент должен его подписать и отправить обратно_ - ждем пояснений

Экстринсик - это запрос наизменение данных в блокчейне
Чтобы внести изменения в блокчейн, необходимо сформировать запрос (экстринсик) с определенными параметрами, который состоят из 3 частей:
1) Секция блокчейна, фунционал
2) Метод секции
3) Массив аргументов

После того как экстринзик был сформирован - он должен быть подписан, чтобы чейн выполнил запрошенные изменения


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
    - [Extrinsic submit](#post-extrinsicsubmit)
    - [Extrinsic sign](#post-extrinsicsign)
    - [Extrinsic verify-sign](#post-extrinsicverify-sign)
  - [Additional Methods](#additional-methods)
    - [Сhain](#hain-properties)
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

Назначение метода: собирает экстринзик и дает в ответе разные варианты того как его можно подписать 

#### Request

Request body
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
 <summary>CURL Example</summary>
  
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
Http Status 200 with body:

<details>
  <summary>Unsigned Extrinsic Response</summary>

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

</details>

### POST /extrinsic/submit

Назначение метода: отправить подписанный экстринзик в чейн

#### Request
Curl example

<details> <summary> JSON </summary>

```bash
curl -X 'POST' \
  'https://web.uniquenetwork.dev/extrinsic/submit' \
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

Request body (Example Value, Schema)

<details> <summary> JSON </summary>

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


### POST /extrinsic/sign

Назначение метода: подписать экстринзик

#### Request
Curl example

```bash
curl -X 'POST' \
  'https://web-quartz.unique.network/extrinsic/sign' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "signerPayloadHex": "string"
  }'
```

Request body (Example Value, Schema)

```json
{
  "signerPayloadHex": "string"
}
```

Parameters - No parameters

#### Response
Успешный ответ - 201 OK и содержит тело:

```json
{
  "signature": "string"
}
```

Каждый элемент коллекции содержит следующую информацию:

название | комментарий
---------|------------
signature | *********

### POST /extrinsic/verify-sign

Назначение метода: проверить подпись экстринзика

#### Request
Curl example

<details> <summary> JSON </summary>

```json
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

Request body (Example Value, Schema)

<details> <summary> JSON </summary>

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
</details>


Parameters - No parameters

#### Response
Успешный ответ - 201 OK и содержит тело:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

Каждый элемент коллекции содержит следующую информацию:

название | комментарий
---------|------------
statusCode | *********
message | *********



## Additional Methods

### GET /chain/properties
Назначение метода: запрашивает служебные поля, необходимые для работы с блокчейном


#### Request

Curl example
```bash
curl -X 'GET' \
  'https://web-quartz.unique.network/chain/properties' \
  -H 'accept: application/json'
```

Parameters - No parameters


#### Response

200 OK или default содержит тело:

```json
{
  "SS58Prefix": 255,
  "decimals": 18,
  "token": "QTZ",
  "wsUrl": "wss://quartz.unique.network"
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

#### GET /balance
Назначение метода: возвращает баланс счета в форматированном и неформатированном виде
#### Request

Curl example
```bash
curl -X 'GET' \
  'https://web-quartz.unique.network/balance?address=yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm' \
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
Назначение метода: создает неподписанный экстринзик на странсфер определенной суммы коинов
#### Request
Curl example

```bash
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
```json
{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "destination": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "amount": 0.01
}
```
Parameters - No parameters

#### Response

Успешный ответ - 201 OK и содержит тело:

<details> <summary> JSON </summary>

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
</details>

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

#### GET /collection
Назначение метода: возвращает информацию о коллекции по id
#### Request
Curl example

```bash
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

<details> <summary> JSON </summary>

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
</details>

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
Назначение метода: формирует неподписанный экстринзик для создания коллекции с опредленными параметрами
#### Request
Curl example

<details> <summary> JSON </summary>

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

Request body (Example Value, Schema)

<details> <summary> JSON </summary>

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
</details>

Parameters - No parameters

#### Response
Успешный ответ - 201 OK и содержит тело:

<details> <summary> JSON </summary>

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
</details>
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
Назначение метода: формирует неподписанный экстринзик для удаления выбранной коллекции
#### Request
Curl example


```bash
curl -X 'DELETE' \
  'https://web.uniquenetwork.dev/collection?collectionId=1&address=yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz7867' \
  -H 'accept: application/json'
```

Request body (Example Value, Schema)
```json
{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "collectionId": 0
}
```

Parameters - No parameters


#### Response
Успешный ответ - 200 OK и содержит тело:

<details> <summary> JSON </summary>

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
</details>

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



#### PATCH /collection/transfer
Назначение метода: формирует неподписанный экстринзик для передачи прав на коллекции

#### Request
Curl example


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

Request body (Example Value, Schema)
```json
{
  "collectionId": 0,
  "from": "string",
  "to": "string"
}
```

Parameters - No parameters

#### Response
Успешный ответ - 200 OK и содержит тело:

<details> <summary> JSON </summary>

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
</details>

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
Назначение метода: возвращает информацию о токене по id коллекции и токена
#### Request
Curl example
```bash
curl -X 'GET' \
  'https://web-quartz.unique.network/token?collectionId=1&tokenId=1' \
  -H 'accept: application/json'
```

Parameters
Параметр | комментарий
---------|------------
collectionId  | ***********
tokenId   | ***********

#### Response
Успешный ответ - 200 OK и содержит тело:
```json
{}
```

#### POST /token
Назначение метода: создает неподписанный экстринзик на создание токена внутри коллекции
#### Request
Curl example
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

Request body (Example Value, Schema)
```json
{
  "address": "string",
  "collectionId": 0,
  "constData": {}
}
```

Parameters - No parameters

#### Response
Успешный ответ - 201 OK и содержит тело:

<details> <summary> JSON </summary>

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
</details>

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
Назначение метода: формирует неподписанный экстринзик для удаления выбранного токена
#### Request
Curl example
```bash
curl -X 'DELETE' \
  'https://web-quartz.unique.network/token?collectionId=1&tokenId=1&address=yGCyN3eydMkze4EPtz59Tn7obwbU32438FRdemTaLwm' \
  -H 'accept: application/json'
```

Request body (Example Value, Schema)
```json
{
  "address": "string",
  "collectionId": 0,
  "tokenId": 0
}
```

Parameters - No parameters

#### Response
Успешный ответ - 200 OK и содержит тело:

<details> <summary> JSON </summary>

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
</details>

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
Назначение метода: формирует неподписанный экстринзик для передачи прав на токен
#### Request
Curl example
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

Request body (Example Value, Schema)
```json
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

<details> <summary> JSON </summary>

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
</details>

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

