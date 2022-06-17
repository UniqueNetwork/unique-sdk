<div align="center">
    <img width="400px" src="../../doc/logo-white.svg" alt="Unique Network">
<br/>
<br/>

[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
[![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/)
![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-sdk?style=flat-square)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
![GitHub Release Date](https://img.shields.io/github/release-date/uniquenetwork/unique-sdk?style=flat-square)
![GitHub](https://img.shields.io/github/v/tag/uniquenetwork/unique-sdk?style=flat-square)
[![stability-alpha](https://img.shields.io/badge/stability-alpha-f4d03f.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#alpha)
</div>



# Intro
SDK is an JavaScript/TypeScript library which helps to interact with UniqueNetwork using simple methods instead of low-level API. With SDK you can mint collections and tokens, manage account balance etc.
At the moment the library is an pre-alpha version. We will be grateful for the feedback and ideas for improvement.

#  Table of Contents

- [Installation](#Installation)
- [Initialize SDK](#Initialize-SDK)
- [Usage examples](#Usage-examples)
  - [Collection creation](#Collection-creation)
  - [Token creation](#Token-creation)
  - [Token transfer](#Token-transfern)
- [Design](#design)
  - [Modules](#modules)
  - [Mutation and Query method](#mutation-and-query-methods)

# Installation
Install the package:
```shell
npm i --save @unique-nft/sdk
```

# Initialize SDK
```ts
import { SdkSigner } from "@unique-nft/sdk/types";
import { createSigner } from "@unique-nft/sdk/sign";
import { Sdk } from "@unique-nft/sdk";

export async function createSdk(): Promise<Sdk> {
  const options = {
    chainWsUrl: 'wss://quartz.unique.network',
    ipfsGatewayUrl: 'https://ipfs.unique.network/ipfs/',
  }
  const signerOptions = {
    seed: '//Alice', // Signer seed phrase
  };
  const signer: SdkSigner = await createSigner(signerOptions);
  return await Sdk.create({
    ...options,
    signer,
  });
}

```

# Usage examples

## Collection creation
<details>
<summary>Collapse</summary>


```ts
import { Sdk } from "@unique-nft/sdk";
import { INamespace } from "protobufjs";
import {
  CreateCollectionArguments,
  SignTxResult,
  SubmitTxArguments,
  UnsignedTxPayload,
} from "@unique-nft/sdk/types";
import { ISubmittableResult } from "@polkadot/types/types/extrinsic";
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/extrinsics';

export async function createCollection(sdk: Sdk, address: string): Promise<number> {
    const constOnChainSchema: INamespace = {
        nested: {
            onChainMetaData: {
                nested: {
                    NFTMeta: {
                        fields: {
                            FieldA: {
                                id: 1,
                                rule: 'required',
                                type: 'string',
                            },
                            FieldB: {
                                id: 2,
                                rule: 'required',
                                type: 'string',
                            },
                        },
                    },
                },
            },
        },
    };

    const createArgs: CreateCollectionArguments = {
        name: 'My collection',
        description: 'my test collection',
        tokenPrefix: 'FOO',
        properties: {
            schemaVersion: 'Unique',
            constOnChainSchema,
        },
        address,
    };
    const txPayload: UnsignedTxPayload = await sdk.collections.create(createArgs);

    const signTxResult: SignTxResult = await sdk.extrinsics.sign(txPayload);

    const submitTxArgs: SubmitTxArguments = {
        signerPayloadJSON: txPayload.signerPayloadJSON,
        signature: signTxResult.signature
    };

    return new Promise(resolve => {
        let collectionId = 0;
        function resultCallback(result: ISubmittableResult) {
            const createdEvent = result.events.find(event => event.event.method === 'CollectionCreated');
            if (createdEvent) collectionId = +createdEvent.event.data[0];
            if (result.isCompleted) resolve(collectionId);
        }
        sdk.extrinsics.submit(submitTxArgs, resultCallback);
    })
}
```

</details>

## Token creation
```ts
import { Sdk } from "@unique-nft/sdk";
import {
  CreateTokenArguments,
  SignTxResult,
  SubmitTxArguments,
  UnsignedTxPayload,
} from "@unique-nft/sdk/types";
import { ISubmittableResult } from "@polkadot/types/types/extrinsic";
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/extrinsics';

export async function createToken(sdk: Sdk, address: string, collectionId: number): Promise<number> {
    const constData = {
        FieldA: 'My field a',
        FieldB: 'My field b',
    };

    const createArgs: CreateTokenArguments = {
        address,
        owner: address,
        collectionId,
        constData,
    };
    const txPayload: UnsignedTxPayload = await sdk.tokens.create(createArgs);

    const signTxResult: SignTxResult = await sdk.extrinsics.sign(txPayload);

    const submitTxArgs: SubmitTxArguments = {
        signerPayloadJSON: txPayload.signerPayloadJSON,
        signature: signTxResult.signature
    };

    return new Promise(resolve => {
        let tokenId = 0;
        function resultCallback(result: ISubmittableResult) {
            const createdEvent = result.events.find(event => event.event.method === 'ItemCreated');
            if (createdEvent) tokenId = +createdEvent.event.data[1];
            if (result.isCompleted) resolve(tokenId);
        }
        sdk.extrinsics.submit(submitTxArgs, resultCallback);
    })
}
```

## Token transfer
```ts
import { Sdk } from "@unique-nft/sdk";
import {
  SignTxResult,
  SubmitTxArguments,
  TransferTokenArguments,
} from "@unique-nft/sdk/types";
import { ISubmittableResult } from "@polkadot/types/types/extrinsic";
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/extrinsics';

export async function transferToken(
    sdk: Sdk,
    addressFrom: string,
    addressTo: string,
    collectionId: number,
    tokenId: number
) {
    const transferArgs: TransferTokenArguments = {
        from: addressFrom,
        to: addressTo,
        tokenId: tokenId,
        collectionId: collectionId,
    }
    const txPayload = await sdk.tokens.transfer(transferArgs);

    const signTxResult: SignTxResult = await sdk.extrinsics.sign(txPayload);

    const submitTxArgs: SubmitTxArguments = {
        signerPayloadJSON: txPayload.signerPayloadJSON,
        signature: signTxResult.signature
    };

    return new Promise(resolve => {
        function resultCallback(result: ISubmittableResult) {
            if (result.isCompleted) resolve(true);
        }
        sdk.extrinsics.submit(submitTxArgs, resultCallback);
    })
}
```

# Design

СДК спроектирован вокруг полькадот апи-промис,
расширяет его удобными методами для работы с сетью Юник (опал, кварц).
Тем не менее СДК может быть подключен к любой сети на фреймворке субстрат и
основные модули (эксринсик, баланс, квери) так же могут быть использованы.


## Modules
СДК реализовывает только подключение к блокчейн-сети,
а модули расширяют его возможности. Модули реализованы как секондари-ендпоинты
НПМ-пакета, это позвляет гибко управлять зависимостями, не включать ненужные модули
в сборку бандла приложения, расширять СДК собственными модулями.

```typescript
import { Sdk } from "@unique-nft/sdk";

// ... 

import '@unique-nft/sdk/extrinsics'; // Augment SDK with the `extrinsic` property

```

Сейчас у нас есть 4 освновных модуля

- [Extrinsics](./extrinsics) - собирает, подписывает эксринсики
- [State Queries](./state-queries) - формирует запросы к чейну
- [Sign](./sign) - работа с аккаунтами
- [Balance](./balance) - работа с балансами нативных токенов
- [Tokens](./tokens) - работает с NFT, RFT Unique-сетей (опал, кварц, юник)

Модули могут быть зависимы друг от друга. Так, например, модуль баланса зависит
от модулуля экстринсик, потому что формирует эксринсики трансфера и сабмитит их в чейн.


## Mutation and Query methods

Мы разделили все методы СДК на два типа
1) [Query](#query-method) методы для чтения стораджей сети
(например баланс, или свойства токена)

```typescript
const collectionId = 1;
const tokenId = 3456;
const collection = await sdk.collections.get({ collectionId, tokenId });
```
2) [Mutation](#mutation-method) методы для обновления состояния блокчейна
```typescript
const args = {
  tokenId,
  collectionId,
  from: addressFrom,
  to: addressTo,
}
const unsignedExtrinsic = await sdk.tokens.transfer(args);
```

### Query method


### Mutation method
По умолчанию они возвращают неподписанный экстринсик.
Чтобы применить это изменение необходимо подписать его

```typescript
import { createSigner } from "@unique-nft/sdk/sign";
const signer: SdkSigner = await createSigner(signerOptions);
const unsignedExtrinsic = await sdk.tokens.transfer(args);
const {signature, signatureType} = await signer.sign(unsignedExtrinsic);
```

И уже отправить в чейн экстринсик и подпись к нему
```typescript
const hash = await sdk.extrinsics.submit(
  signature,
  signatureType,
  ... unsignedExtrinsic,
);
```
