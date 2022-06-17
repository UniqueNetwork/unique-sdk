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



# @unique-nft/sdk
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

### npm
```shell
npm i --save @unique-nft/sdk
```

### yarn
```shell
yarn add @unique-nft/sdk
```

### git
```shell
git clone https://github.com/UniqueNetwork/unique-sdk
cd unique-sdk
npm install
npm run build:sdk
```

# Initialize SDK
```typescript
import { createSigner } from "@unique-nft/sdk/sign";
import { Sdk } from "@unique-nft/sdk";

(async () => {
  const sdk = await Sdk.create({
    chainWsUrl: 'wss://quartz.unique.network',
    signer: await createSigner({
      seed: '//Alice', // Signer seed phrase if you want to sign extrinsics
    }),
  });
})();
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
import { Sdk, addFeature } from "@unique-nft/sdk";

// ... 

import '@unique-nft/sdk/extrinsics';
import { addFeature } from './add-feature'; // Augment SDK with the `extrinsic` property

// ... 
class MyOwnSdkModule {
  constructor(private sdk: Sdk) {
  }
  
  public hello() {
    return 'world!';
  }
}

addFeature('my-own-feature', MyOwnSdkModule);

console.log(sdk.hello);

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
const transferArgs = {
  tokenId,
  collectionId,
  from: addressFrom,
  to: addressTo,
}
const unsignedExtrinsic = await sdk.tokens.transfer(transferArgs);
```

### Query method


### Mutation method
По умолчанию они возвращают неподписанный экстринсик.
Чтобы применить это изменение необходимо подписать его

```typescript
import { createSigner } from "@unique-nft/sdk/sign";
const signer: SdkSigner = await createSigner(signerOptions);
const unsignedExtrinsic = await sdk.tokens.transfer(transferArgs);
const { signature, signatureType } = await signer.sign(unsignedExtrinsic);
```

И уже отправить в чейн экстринсик и подпись к нему
```typescript
const hash = await sdk.extrinsics.submit(
  signature,
  signatureType,
  ... unsignedExtrinsic,
);
```

Для удобства мы реализовали [комплексный метод](./extrinsics#complex-method):
если инициализировать СДК с подписантом то можно подписывать и отправлять эксринсики
бесшовно, без отдельных действий

```typescript
import { SdkSigner } from "@unique-nft/sdk/types";
import { createSigner } from "@unique-nft/sdk/sign";
import { Sdk } from "@unique-nft/sdk";
import "@unique-nft/sdk/balance";
import { ExtrinsicOptions } from "@unique-nft/sdk/extrinsics";

const sdk = await Sdk.create({
  chainWsUrl: 'wss://quartz.unique.network',
  signer: await createSigner({
    seed: '//Alice', // Signer seed phrase
  }),
});

const unsignedExtrinsic = await sdk.balance.transfer(transferArgs);
const signedExtrinsic = await sdk.balance.transfer(transferArgs, ExtrinsicOptions.Sign);
const hash = await sdk.balance.transfer(transferArgs, ExtrinsicOptions.Submit);
const result = await sdk.balance.transfer(transferArgs, ExtrinsicOptions.Watch);
```

Когда мы передаем опцию `ExtrinsicOptions.Watch` метод распарсит данные евентов
и вернет связанные с этим эксринсиком данные

```typescript
const { collectionId } = await sdk.collections.create({ ... }, ExtrinsicOptions.Watch);
```

