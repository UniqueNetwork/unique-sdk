[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
[![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/)
![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/marketplace-frontend?style=flat-square)
![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-marketplace-frontend?style=flat-square)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)

_нужен раздел че это такое, ссылки на публичные экзепмляры, докерхаб, на наш сайт_



_так же расписать что концептульно апи собирает экстринсик, клиент должен его подписать и отправить обратно_ - ждем пояснений

_туду: будет вариант самоподписывающихся транзакций если мы передадим сид в апи_ - ждем

## Table of Contents

- [Prerequisites](#)
- [Установка СДК (пока нет - ждем(варианты 1(публичный)-2(поднимать полностью))) :](#)
  - [Шаг 1 -......](#)
  - [.............](#)
  - [Шаг N -......](#)

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

_тут надо будет расписать: 
1) запуск образа с докерхаба; 
2) билд и запуск и репы; 
3) использование наших публичных доменов_ - ждем Арсения


# Methods

## Main Methods

### Extrinsic build

Назначение метода: *******

POST /extrinsic/build

Parameters - No parameters

#### Request

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

Каждый элемент коллекции содержит следующую информацию:


название   | комментарий
-----------|------------
address    | *********
section    | *********
method     | *********
args       | *********
era        | *********
isImmortal | **********

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


### Extrinsic submit

Назначение метода: *******

POST /extrinsic/submit

Parameters - No parameters

#### Request

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

Каждый элемент коллекции содержит следующую информацию:

название | ********
---------|------------
signature | ********
signatureType | ********
signerPayloadJSON | ********
address | ********
blockHash | ********
blockNumber | ********
era | ********
genesisHash | ********
method | ********
nonce | ********




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

_вот здесь лучше предлагать сразу пример курловый, и выделить как код типа_
```shell
curl -X GET https://web-quartz.unique.network/chain/properties
```

Parameters - No parameters

_как то выделить Request, Response_

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

Parameters
Параметр | тип | комментарий
---------|-----|------------
address  | string |

Ответ:
Успешный ответ - 200 OK и содержит тело:

```json
{
"amount": "411348197000000000000",
"formatted": "411.3481 QTZ"
}
```

Каждый элемент коллекции содержит следующую информацию:

название | тип | комментарий
---------|-----|------------
amount | *** |
formatted | *** |

#### POST /balance/transfer

Parameters

Request body (Example Value, Schema)
```
{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "destination": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "amount": 0.01
}
```

Ответ:
Успешный ответ - 201 OK и содержит тело:

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

Каждый элемент коллекции содержит следующую информацию:


название | тип | комментарий
---------|-----|------------
signerPayloadJSON | строка |
address | строка |
blockHash | строка |
blockNumber | строка |
era | строка |
genesisHash | строка |
method | строка |
nonce | строка |
specVersion | строка |
tip | строка |
transactionVersion | строка |
signedExtensions | строка |
version | число |
signerPayloadRaw | строка |
address | срока |
data |строка |
type | строка |
signerPayloadHex | строка |

### Collection

Назначение метода: *******

#### GET /collection

Parameters
Параметр | тип | комментарий
---------|-----|------------
collectionId  | число |

Ответ:
Успешный ответ - 200 OK и содержит тело:
```
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
Каждый элемент коллекции содержит следующую информацию:

название | тип | комментарий
---------|-----|------------
mode | строка |
access | строка |
schemaVersion | строка |
constOnChainSchema | ??? |
nested | ??? |
onChainMetaData | ??? |
NFTMeta | ??? |
fields | ??? |
ipfsJson | ??? |
id | число |
rule | строка |
type | строка |
variableOnChainSchema | ??? |
id | число |
description | срока |
limits | ??? |
accountTokenOwnershipLimit | число |
sponsoredDataSize | число |
sponsoredDataRateLimit | число |
tokenLimit | число |
sponsorTransferTimeout | число |
sponsorApproveTimeout | число |
ownerCanTransfer | булево |
ownerCanDestroy | булево |
transfersEnabled | булево |
metaUpdatePermission | ??? |
mintMode | булево |
name | строка |
offchainSchema | булево |
owner | строка |
sponsorship | ??? |
address | строка |
isConfirmed | булево |
tokenPrefix | строка |

#### Ошибки

***** - ошибка(?)

#### POST /collection

Parameters - No parameters

Request body (Example Value, Schema)
```
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

Ответ:
Успешный ответ - 201 OK и содержит тело:
```
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

название | тип | комментарий
---------|-----|------------
signerPayloadHex | строка |
signerPayloadJSON | строка |
address | строка |
blockHash | строка |
blockNumber | строка |
era | строка |
genesisHash | строка |
method | строка |
nonce | строка |
specVersion | строка |
tip | строка |
transactionVersion | строка |
signedExtensions | строка |
version | строка |
signerPayloadRaw | строка |
address | строка |
data | строка |
type | строка |


#### Ошибки

***** - ошибка(?)

#### DELETE /collection

Parameters - No parameters

Request body (Example Value, Schema)
```
{
  "address": "yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm",
  "collectionId": 0
}
```

Ответ:
Успешный ответ - 200 OK и содержит тело:
```
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

название | тип | комментарий
---------|-----|------------
signerPayloadHex | строка |
signerPayloadJSON | строка |
address | строка |
blockHash | строка |
blockNumber | строка |
era | строка |
genesisHash | строка |
method | строка |
nonce | строка |
specVersion | строка |
tip | строка |
transactionVersion | строка |
signedExtensions | строка |
version | строка |
signerPayloadRaw | строка |
address | строка |
data | строка |
type | строка |


#### Ошибки

***** - ошибка(?)

#### PATCH /collection

Parameters - No parameters

Request body (Example Value, Schema)
```
{
  "collectionId": 0,
  "from": "string",
  "to": "string"
}
```

Ответ:
Успешный ответ - 200 OK и содержит тело:
```
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

название | тип | комментарий
---------|-----|------------
signerPayloadHex | строка |
signerPayloadJSON | строка |
address | строка |
blockHash | строка |
blockNumber | строка |
era | строка |
genesisHash | строка |
method | строка |
nonce | строка |
specVersion | строка |
tip | строка |
transactionVersion | строка |
signedExtensions | строка |
version | строка |
signerPayloadRaw | строка |
address | строка |
data | строка |
type | строка |


#### Ошибки

***** - ошибка(?)




### Token


#### POST /token

Parameters - No parameters

Request body (Example Value, Schema)
```
{
  "address": "string",
  "collectionId": 0,
  "constData": {}
}
```

Ответ:
Успешный ответ - 201 OK и содержит тело:

```
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

название | тип | комментарий
---------|-----|------------
mode | строка |
nested | ??? |
onChainMetaData | ??? |
NFTMeta | ??? |
fields | ??? |
ipfsJson | ??? |
id | число |
rule | строка |
type | строка |
variableOnChainSchema | ??? |
id | число |
description | срока |
limits | ??? |
accountTokenOwnershipLimit | число
owner | строка |
sponsorship | ??? |
address | строка |
isConfirmed | булево |
tokenPrefix | строка |

#### Ошибки

***** - ошибка(?)

#### DELETE /token

Parameters - No parameters

Request body (Example Value, Schema)
```
{
  "address": "string",
  "collectionId": 0,
  "tokenId": 0
}
```

Ответ:
Успешный ответ - 200 OK и содержит тело:

```
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

название | тип | комментарий
---------|-----|------------
mode | строка |
nested | ??? |
onChainMetaData | ??? |
NFTMeta | ??? |
fields | ??? |
ipfsJson | ??? |
id | число |
rule | строка |
type | строка |
variableOnChainSchema | ??? |
id | число |
description | срока |
limits | ??? |
accountTokenOwnershipLimit | число
owner | строка |
sponsorship | ??? |
address | строка |
isConfirmed | булево |
tokenPrefix | строка |

#### Ошибки

***** - ошибка(?)

#### PATCH /token

Parameters - No parameters

Request body (Example Value, Schema)
```
{
  "collectionId": 0,
  "from": "string",
  "to": "string",
  "tokenId": 0
}
```

Ответ:
Успешный ответ - 200 OK и содержит тело:

```
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

название | тип | комментарий
---------|-----|------------
mode | строка |
nested | ??? |
onChainMetaData | ??? |
NFTMeta | ??? |
fields | ??? |
ipfsJson | ??? |
id | число |
rule | строка |
type | строка |
variableOnChainSchema | ??? |
id | число |
description | срока |
limits | ??? |
accountTokenOwnershipLimit | число
owner | строка |
sponsorship | ??? |
address | строка |
isConfirmed | булево |
tokenPrefix | строка |

#### Ошибки

***** - ошибка(?)