1. [Install](#Install)
2. [Create sdk](#create-sdk)
3. [Create account](#create-account)
4. [Create collection](#create-collection)
5. [Create token](#create-token)
6. [Transfer token](#transfer-token)
7. [Compile and run](#compile-and-run)

## Install
Install the package:
```
npm i --save @unique-nft/sdk
```

## Create sdk
Create file "createSdk.ts" with this code:
```ts
import {SdkSigner} from "@unique-nft/sdk/types";
import {createSigner} from "@unique-nft/sdk/sign";
import {Sdk} from "@unique-nft/sdk";

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

## Create account
Create file "createAccount.ts" with this code:
```ts
import {KeyringPair} from "@polkadot/keyring/types";
import {Keyring} from "@polkadot/keyring";

export function createAccount(uri: string): KeyringPair {
    const keyring = new Keyring({ type: 'sr25519' });
    return keyring.addFromUri(uri);
}
```

## Create collection
Create file "createCollection.ts" with this code:
```ts
import {Sdk} from "@unique-nft/sdk";
import {KeyringPair} from "@polkadot/keyring/types";
import {INamespace} from "protobufjs";
import {CreateCollectionArguments, SignTxResult, SubmitTxArguments, UnsignedTxPayload} from "@unique-nft/sdk/types";
import {ISubmittableResult} from "@polkadot/types/types/extrinsic";
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

## Create token
Create file "createToken.ts" with this code:
```ts
import {Sdk} from "@unique-nft/sdk";
import {KeyringPair} from "@polkadot/keyring/types";
import {CreateTokenArguments, SignTxResult, SubmitTxArguments, UnsignedTxPayload} from "@unique-nft/sdk/types";
import {ISubmittableResult} from "@polkadot/types/types/extrinsic";
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
        let collectionId = 0;
        function resultCallback(result: ISubmittableResult) {
            const createdEvent = result.events.find(event => event.event.method === 'ItemCreated');
            if (createdEvent) collectionId = +createdEvent.event.data[1];
            if (result.isCompleted) resolve(collectionId);
        }
        sdk.extrinsics.submit(submitTxArgs, resultCallback);
    })
}
```

## Transfer token
Create file "transferToken.ts" with this code:
```ts
import {Sdk} from "@unique-nft/sdk";
import {KeyringPair} from "@polkadot/keyring/types";
import {SignTxResult, SubmitTxArguments, TransferTokenArguments} from "@unique-nft/sdk/types";
import {ISubmittableResult} from "@polkadot/types/types/extrinsic";
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
        let collectionId = 0;
        function resultCallback(result: ISubmittableResult) {
            if (result.isCompleted) resolve(collectionId);
        }
        sdk.extrinsics.submit(submitTxArgs, resultCallback);
    })
}
```

## App
Create file "index.ts" with this code:
```ts
import {KeyringPair} from "@polkadot/keyring/types";
import {createSdk} from "./src/createSdk";
import {createAccount} from "./src/createAccount";
import {createCollection} from "./src/createCollection";
import {createToken} from "./src/createToken";
import {transferToken} from "./src/transferToken";

async function main() {
  const seed = '//Ferdie';
  const sdk = await createSdk(seed);
  const accountFerdie: KeyringPair = createAccount(seed);

  // create collection
  const collectionId = await createCollection(sdk, accountFerdie);
  const collection = await sdk.collection.get({collectionId});
  console.log('collection', collection);

  // create token
  const tokenId = await createToken(sdk, accountFerdie, collection.id);
  const token = await sdk.token.get({
    collectionId: collection.id,
    tokenId,
  })
  console.log('token', token);

  // transfer token to other account
  const accountAlice: KeyringPair = createAccount('//Alice');
  await transferToken(sdk, accountFerdie, accountAlice, collection.id, token.id);
  const tokenAfterTransfer = await sdk.token.get({
    collectionId: collection.id,
    tokenId,
  })
  console.log('token after transfer', tokenAfterTransfer);

  await sdk.api.disconnect();
}

main();
```

## Compile and run
Compile and run the application:
```bash
tsc index.ts --skipLibCheck
node index.js
```

