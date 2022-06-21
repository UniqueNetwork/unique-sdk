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
SDK is a JavaScript/TypeScript library which helps to interact with UniqueNetwork using simple methods instead of low-level API. With SDK you can mint collections and tokens, manage account balance, etc.
At the moment, the library is a pre-alpha version. We will be grateful for the feedback and ideas for improvement. ```

___
#  Table of Contents

- [Installation](#Installation)
- [Initialize](#Initialize-SDK)
- [Design](#design)
  - [Modules](#modules)
  - [Mutation and Query method](#mutation-and-query-methods)

___
# Installation

### npm
```shell
npm install @unique-nft/sdk
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
___
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

___
# Design

Unique SDK was developed as an add-on of
<a href="https://polkadot.js.org/docs/api/start" target="_blank">Polkadot{.js} ApiPromise</a>,
extending it with simple methods to work with the Unique Network blockchains
(Opal, Quartz, Unique).
However, Unique SDK can be connected to any network based on the
<a href="https://substrate.io" target="_blank">Substrate framework</a>,
and the main modules (extrinsics, balance, query, sign, etc.) can also be used.

___
## Modules

By default, the SDK implements only a connection to the blockchain network,
and modules expand its capabilities. Modules are implemented as secondary endpoints
of NPM package, this allows you to flexibly manage dependencies, do not include unnecessary modules
into the application bundle assembly, expand the SDK with your own modules.

```typescript
import { Sdk, addFeature } from "@unique-nft/sdk";

// ... 

import '@unique-nft/sdk/extrinsics'; // Augment SDK with the `extrinsic` property
import { addFeature } from './add-feature';

// ... 
class MyOwnSdkModule {
  constructor(private sdk: Sdk) {
  }
  
  public hello() {
    return 'world!';
  }
}

addFeature('myOwnFeature', MyOwnSdkModule);

console.log(sdk.myOwnFeature.hello());

```

Now the SDK includes 5 modules

- [Extrinsics](./extrinsics) - for build, sign and submit extrinsics
- [State Queries](./state-queries) - queries blockchain storage
- [Sign](./sign) - account management: sign, addresses
- [Balance](./balance) - get and transfers native substrate token
- [Tokens](./tokens) - operations with NFT of Unique Network blockchains (Opal, Unique, Quartz)

Modules can be dependent on each other. So, for example, the Balance Module depends
from the Extrinsic Module,
because it generates extrinsics of the transfer and submits them to the blockchain.

___
## Mutation and Query methods

We have divided all SDK methods into two types
1) [Query](#query-method) methods for reading blockchain storage
   (e.g. balance, or token properties)

```typescript
import "@unique-nft/sdk/tokens"

const collectionId = 1;
const tokenId = 3456;
const token = await sdk.tokens.get({ collectionId, tokenId });
2) [Mutation](#mutation-method) methods for updating the state of the blockchain
```typescript
const transferArgs = {
  tokenId,
  collectionId,
  from: addressFrom,
  to: addressTo,
}
const unsignedExtrinsic = await sdk.tokens.transfer(transferArgs);
```
___
### Query methods
Queries to blockchain storage that return data in human format

```typescript

const address = 'unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx';
/**
 * returns
 * {
 *  "raw": "0",
 *  "amount": 0,
 *  "amountWithUnit": "0",
 *  "formatted": "0",
 *  "unit": "UNQ"
 * }
 */
const { raw, amount, amountWithUnit, formatted, unit } = await sdk.balance.get({ address });
```

___
### Mutation methods
By default, they return an unsigned extension.
To apply this change in the blockchain state, you must sign it

```typescript
import { createSigner } from "@unique-nft/sdk/sign";
const signer: SdkSigner = await createSigner(signerOptions);
const unsignedExtrinsic = await sdk.tokens.transfer(transferArgs);
const { signature, signatureType } = await signer.sign(unsignedExtrinsic);
```

And send an extrinsic and a signature to it in the blockchain

```typescript
const hash = await sdk.extrinsics.submit({
  signature,
  signatureType,
  ...unsignedExtrinsic,
});
```

For convenience, we have implemented a [complex method](./extrinsics#complex):
if you initialize the SDK with a signer, you can sign and send extrinsics
seamlessly, without separate actions

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

/**
 * returns unsigned extrinsic
 */
const unsignedExtrinsic = await sdk.balance.transfer(transferArgs);

/**
 * return signed extrinsic (unsigned extrinsic + signature + signature type)
 */
const signedExtrinsic = await sdk.balance.transfer(transferArgs, ExtrinsicOptions.Sign);

/**
 * submitting extrinsic and returns hash
 */
const hash = await sdk.balance.transfer(transferArgs, ExtrinsicOptions.Submit);

/**
 * submitting extrinsic and returns final result (status, events, other human info)
 */
const result = await sdk.balance.transfer(transferArgs, ExtrinsicOptions.Watch);
```

When we pass the `ExtrinsicOptions.Watch` option, the method will parse the event data
and return the data associated with this extrinsic

```typescript
const { collectionId } = await sdk.collections.create({ ... }, ExtrinsicOptions.Watch);
```

