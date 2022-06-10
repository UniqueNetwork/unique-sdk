<div align="center">
    <img src="/doc/logo-white.svg" alt="Unique White Label">
</div>

[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org) [![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/) ![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/marketplace-frontend?style=flat-square) ![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-marketplace-frontend?style=flat-square) ![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
<!-- ![GitHub Release Date](https://img.shields.io/github/release-date/uniquenetwork/unique-marketplace-frontend?style=flat-square)
![GitHub](https://img.shields.io/github/v/tag/uniquenetwork/unique-marketplace-frontend?style=flat-square) -->


# Intro
This document contains examples of main SDK operations.

##  Table of Contents

- [Deployment](#Deployment)
- [Examples](#Examples)
  - [SDK creation](#SDK-creation)
  - [Account creation](#Account-creation)
  - [Collection creation](#Collection-creation)
  - [Token creation](#Token-creation)
  - [Token transfer](#Token-transfern)

## Deployment
Install the package:
```
npm i --save @unique-nft/sdk
```
# Examples

## SDK creation
```ts
import { SdkSigner } from "@unique-nft/sdk/types";
import { createSigner } from "@unique-nft/sdk/sign";
import { Sdk } from "@unique-nft/sdk";

export async function createSdk(seed: string): Promise<Sdk> {
  const options = {
    chainWsUrl: 'wss://ws-rc.unique.network',
    ipfsGatewayUrl: 'https://ipfs.unique.network/ipfs/',
  }
  const signerOptions = {
    seed,
  };
  const signer: SdkSigner = await createSigner(signerOptions);
  return await Sdk.create({
    ...options,
    signer,
  });
}

```

## Account creation
```ts
import { KeyringPair } from "@polkadot/keyring/types";
import { Keyring } from "@polkadot/keyring";

export function createAccount(uri: string): KeyringPair {
    const keyring = new Keyring({ type: 'sr25519' });
    return keyring.addFromUri(uri);
}
```

## Collection creation
<details>
<summary>Collapse</summary>


```ts
import { Sdk } from "@unique-nft/sdk";
import { KeyringPair } from "@polkadot/keyring/types";
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

export async function createCollection(sdk: Sdk, account: KeyringPair): Promise<number> {
    console.log('collection creation ...');
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
        address: account.address,
    };
    const txPayload: UnsignedTxPayload = await sdk.collection.create(createArgs);

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
import { KeyringPair } from "@polkadot/keyring/types";
import {
  CreateTokenArguments,
  SignTxResult,
  SubmitTxArguments,
  UnsignedTxPayload,
} from "@unique-nft/sdk/types";
import { ISubmittableResult } from "@polkadot/types/types/extrinsic";
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/extrinsics';

export async function createToken(sdk: Sdk, account: KeyringPair, collectionId: number): Promise<number> {
    console.log('token creation ...');
    const constData = {
        FieldA: 'My field a',
        FieldB: 'My field b',
    };

    const createArgs: CreateTokenArguments = {
        address: account.address,
        owner: account?.address,
        collectionId,
        constData,
    };
    const txPayload: UnsignedTxPayload = await sdk.token.create(createArgs);

    const signTxResult: SignTxResult = await sdk.extrinsics.sign(txPayload);

    const submitTxArgs: SubmitTxArguments = {
        signerPayloadJSON: txPayload.signerPayloadJSON,
        signature: signTxResult.signature
    };

    return new Promise(resolve => {
        let tokenId = 0;
        function resultCallback(result: ISubmittableResult) {
            const createdEvent = result.events.find(event => event.event.method === 'ItemCreated');
            if (createdEvent) collectionId = +createdEvent.event.data[1];
            if (result.isCompleted) resolve(tokenId);
        }
        sdk.extrinsics.submit(submitTxArgs, resultCallback);
    })
}
```

## Token transfer
```ts
import { Sdk } from "@unique-nft/sdk";
import { KeyringPair } from "@polkadot/keyring/types";
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
    accountFrom: KeyringPair,
    accountTo: KeyringPair,
    collectionId: number,
    tokenId: number
) {
    console.log('token transfer ...');
    const transferArgs: TransferTokenArguments = {
        from: accountFrom.address,
        to: accountTo.address,
        tokenId: tokenId,
        collectionId: collectionId,
    }
    const txPayload = await sdk.token.transfer(transferArgs);

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
