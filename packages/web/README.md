[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
[![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/)
![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/marketplace-frontend?style=flat-square)
![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-marketplace-frontend?style=flat-square)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)

_нужен раздел че это такое, ссылки на публичные экзепмляры, докерхаб, на наш сайт_

_так же расписать что концептульно апи собирает экстринсик, клиент должен его подписать и отправить обратно_

_туду: будет вариант самоподписывающихся транзакций если мы передадим сид в апи_
## Table of Contents

- [Prerequisites](#)
- [Установка СДК (пока нет - ждем(варианты 1(публичный)-2(поднимать полностью))) :](#)
  - [Шаг 1 -......](#)
  - [.............](#)
  - [Шаг N -......](#)

- [Unique SDK HTTP API Methods:](#)
  - [Method GET balance](#)
  - [Method 2](#)
  - [Method 3](#)
  - [Method 4](#)
  - [Method 5](#)
  - [Method 6](#)
  - [Method 7](#)
  - [Method 8](#)
  - [Method 9](#)
  - [Method 10](#)

_тут надо будет расписать: 1) запуск образа с докерхаба; 2) билд и запуск и репы; 3) использование наших публичных доменов_
# SDK Deployment - Getting Started Guide

This tutorial shows the steps that need to be performed to carry out an install of the SDK on a computer in a local environment or in a virtual machine with Ubuntu OS. The process of installing it in a production environment is identical, with the caveat that your IT administrator will need to setup the supporting infrastructure (such as a globally accessible domain name, hosting, firewall, nginx, and SSL certificates) so that the server that hosts the SDK can be accessed by the users on the Internet. Visit [https://unqnft.io](https://unqnft.io) to experience an example of a self-hosted, globally accessible SDK.


_вот эта штука не нужна_
## Prerequisites

>  * OS: Ubuntu 18.04 or 20.04
>  * docker CE 20.10 or up
>  * docker-compose 1.25 or up
>  * git
>  * Google Chrome Browser
> * connected to wss://ws-quartz.unique.network


## Methods

### Сhain

_добавлять в т.ч. ссылку на метод в сваггере_
Назначение метода:*******

_вот здесь лучше предлагать сразу пример курловый, и выделить как код типа_
```shell
curl -X GET https://web-quartz.unique.network/chain/properties
```

Parameters - No parameters

_как то выделить Request, Response_
Ответ:
1) Успешный ответ - 200 OK и содержит тело:

_тоже заворачивать в код_
```json
{
  "SS58Prefix": 255,
  "decimals": 18,
  "token": "QTZ",
  "wsUrl": "wss://ws-quartz.unique.network"
}
```

2) Успешный ответ - default и содержит тело:

{
"SS58Prefix": 255,
"decimals": 18,
"token": "QTZ",
"wsUrl": "wss://ws-quartz.unique.network"
}

Каждый элемент коллекции содержит следующую информацию:

название | тип | комментарий
---------|-----|------------
SS58Prefix | строка | префикс чейна
decimals | десятичный | предел коичества знаков после запятой
token | строка | валюта токена
wsUrl | строка | url блокчейна


_ошибки я думаю надо будет прямо в отдельный раздел_
#### Ошибки

***** - ошибка(?)

### Balance

Назначение метода:*******

GET /balance

Parameters - address (string)

Ответ:
Успешный ответ - 200 OK и содержит тело:

_по большому счету ответы надо будет описывать только у квери-запросов типа этого, а вот ответы запросов которые собирают экстринсик будут все одинаковые_

{
"amount": "411348197000000000000",
"formatted": "411.3481 QTZ"
}

Каждый элемент коллекции содержит следующую информацию:

_комментарии поидее можно собирать из сваггера_ 

название | тип | комментарий
---------|-----|------------
amount | строка |
formatted | cnhjrf |

#### Ошибки

***** - ошибка(?)

### Extrinsic

Назначение метода: *******

POST /extrinsic/build

Parameters - No parameters

Запрос:

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

Каждый элемент коллекции содержит следующую информацию:

_есть смысл вынести section/method в енумы? в том числе на стороне кода?_

название | тип | комментарий
---------|-----|------------
address | строка |
section | строка |
method | строка |
args | строка |
era | десятичное |
isImmortal | булево |

Успешный ответ - 201 OK и содержит тело:

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

Каждый элемент коллекции содержит следующую информацию:

название | тип | комментарий
---------|-----|------------
signerPayloadHex | строка |
signerPayloadJSON | объект |
address | строка |
blockHash | строка |
blockNumber | десятичное |
era | булево |
genesisHash | строка |
method | строка |
nonce | десятичное |
specVersion | булево |
transactionVersion | строка |
signedExtensions | десятичное |
version | объект |
address | строка |
data | десятичное |
type | объект |

#### Ошибки

***** - ошибка(?)

---------------------
### Extrinsic submit


Назначение метода: *******

POST /extrinsic/submit

Parameters - No parameters

Запрос:

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

Каждый элемент коллекции содержит следующую информацию:

название | тип | комментарий
---------|-----|------------
signature | строка |
signatureType | объект |
signerPayloadJSON | строка |
address | объект |
blockHash | строка |
blockNumber | объект |
era | строка |
genesisHash | объект |
method | строка |
nonce | объект |



_опа опа, а там у нас точно 201, поидее да, хорошо бы_
Успешный ответ - 201 OK и содержит тело:

{
"hash": "string"
}

Каждый элемент коллекции содержит следующую информацию:

название | тип | комментарий
---------|-----|------------
signerPayloadHex | строка |
signerPayloadJSON | объект |

#### Ошибки

***** - ошибка(?)
----------------------


---------------------
### Метод

Назначение метода: *******

(POST /extrinsic/build)

Parameters - No parameters

Запрос:

{}

Каждый элемент коллекции содержит следующую информацию:

название | тип | комментарий
---------|-----|------------
signerPayloadHex | строка |
signerPayloadJSON | объект |


Успешный ответ - 200 OK и содержит тело:

{}

Каждый элемент коллекции содержит следующую информацию:

название | тип | комментарий
---------|-----|------------
signerPayloadHex | строка |
signerPayloadJSON | объект |

#### Ошибки

***** - ошибка(?)
----------------------

---------------------
### Метод

Назначение метода: *******

(POST /extrinsic/build)

Parameters - No parameters

Запрос:

{}

Каждый элемент коллекции содержит следующую информацию:

название | тип | комментарий
---------|-----|------------
signerPayloadHex | строка |
signerPayloadJSON | объект |


Успешный ответ - 200 OK и содержит тело:

{}

Каждый элемент коллекции содержит следующую информацию:

название | тип | комментарий
---------|-----|------------
signerPayloadHex | строка |
signerPayloadJSON | объект |

#### Ошибки

***** - ошибка(?)
----------------------


---------------------
### Метод

Назначение метода: *******

(POST /extrinsic/build)

Parameters - No parameters

Запрос:

{}

Каждый элемент коллекции содержит следующую информацию:

название | тип | комментарий
---------|-----|------------
signerPayloadHex | строка |
signerPayloadJSON | объект |


Успешный ответ - 200 OK и содержит тело:

{}

Каждый элемент коллекции содержит следующую информацию:

название | тип | комментарий
---------|-----|------------
signerPayloadHex | строка |
signerPayloadJSON | объект |

#### Ошибки

***** - ошибка(?)
----------------------
### Collection

Назначение метода: *******

GET /collection

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

POST /collection


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

ddddd

#### Ошибки

***** - ошибка(?)

### Token

GET /token

Назначение метода: *******

Parameters
Параметр | тип | комментарий
---------|-----|------------
collectionId  | число |
TokenID | число |

Ответ:
Успешный ответ - 200 OK и содержит тело:
```
{}
```

#### Ошибки

***** - ошибка(?)

POST /token

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

DELETE /token

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

PATCH /token

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
