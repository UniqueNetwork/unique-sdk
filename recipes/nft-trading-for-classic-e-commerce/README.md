# NFT trading for classic e-commerce

## Table of contents

- [Introduction](#introduction)
- [1. Creating NFTs](#1-creating-nfts)
  - [1.1 Creating a market’s substrate wallet](#11-creating-a-markets-substrate-wallet)
  - [1.2 Getting QTZ tokens](#12-getting-qtz-tokens)
  - [1.3 Creating a collection and NFTs](#13-creating-a-collection-and-nfts)
- [2. Selling preparation](#2-selling-preparation)
  - [2.1 Connecting to the Unique SDK](#21-connecting-to-the-unique-sdk)
  - [2.2 Getting information about a collection, an NFT and it’s owner](#22-getting-information-about-a-collection-an-nft-and-its-owner)
  - [2.3 Getting the customer's substrate wallet address](#23-getting-the-buyers-substrate-wallet-address)
  - [2.4 Getting the wallet address QTZ balance](#24-getting-the-wallet-address-qtz-balance)
- [3. Sending an NFT to the customer](#3-sending-an-nft-to-the-buyer)



## Introduction

---

## 1. Creating NFTs

---
### 1.1 Creating a market’s substrate wallet

---
### 1.2 Getting QTZ tokens

---
### 1.3 Creating a collection and NFTs

---
## 2. Selling preparation

---
### 2.1 Connecting to the Unique SDK

---
### 2.2 Getting information about a collection, an NFT and it’s owner

<details>
  <summary>via @unique-nft/sdk </summary>

  ```javascript
    import '@unique-nft/sdk/tokens';
    
    const collectionId = 1; // Provide the Collection ID
    const tokenId = 3456; // Provide the Token ID
    const collection = await sdk.collections.get({
      collectionId,
    });
    const token = await sdk.tokens.get({
      collectionId,
      tokenId,
    });
  ```
</details>

<details>
  <summary>via HTTP REST API</summary>
  
#### Get collection data

  ```shell
    curl -X 'GET' \
      'https://web-quartz.unique.network/collection?collectionId=1' \
      -H 'accept: application/json'
  ```

#### Get token data

  ```shell
    curl -X 'GET' \
      'https://web-quartz.unique.network/token?collectionId=1&tokenId=3456' \
      -H 'accept: application/json'
  ```
</details>

---
### 2.3 Getting the customer's substrate wallet address

---
### 2.4 Getting the wallet address QTZ balance

<details>
  <summary>via @unique-nft/sdk </summary>

  ```javascript
    import '@unique-nft/sdk/balance';
    const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Provide address of collection owner 
    const balance = await sdk.balance.get({
      address,
    });
  ```
</details>

<details>
  <summary>via HTTP REST API</summary>

#### Get collection data

  ```shell
    curl -X 'GET' \
      'https://web-quartz.unique.network/balance?address=5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' \
      -H 'accept: application/json'
  ```

</details>

---
## 3. Sending an NFT to the buyer

<details>
  <summary>via @unique-nft/sdk </summary>

  ```javascript
    import '@unique-nft/sdk/token';
    import { Sdk } from '@unique-nft/sdk';
    import { createSignerSync } from '@unique-nft/sdk/sign';
    
    const sdk = Sdk.create({
      chainWsUrl: 'wss://quartz.unique.network',
      ipfsGatewayUrl: 'https://ipfs.unique.network/ipfs/',
      signer: createSignerSync({
        seed: '//Alice', // Provide seed of collection owner
      }),
    });

    const from = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Provide address of collection owner
    const to = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'; // Provide address of collection owner
    const collectionId = 1; // Provide the Collection ID
    const tokenId = 3456; // Provide the Token ID
    const extrinsic = await sdk.tokens.get({
      from,
      to,
      collectionId,
      tokenId,
    });
    const signature = await sdk.extrinsics.sign(extrinsic);
    await sdk.extrinsics.submit({
      ... extrinsic,
      ... signature,
    });
  ```
</details>

<details>
  <summary>via HTTP REST API</summary>

#### Build transaction

Provide collectionId, tokenId and addresses of collection owner and customer.

  ```shell
    curl -X 'PATCH' \
        'https://web-quartz.unique.network/token/transfer' \
        -H 'accept: application/json' \
        -H 'Content-Type: application/json' \
        -d '{
        "collectionId": 1,
        "tokenId": 3456,
        "from": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        "to": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
      }'  
  ```
#### Sign transaction

We provide a way to sign transactions on public endpoints for specific needs, but we do not recommend using it for most cases. We highly recommend signing transactions on your service’s side.

Put previous response and add header: `Authorization: Seed //Alice` with collection owner's seed 

  ```shell
    curl -X 'POST' \
        'https://web-quartz.unique.network/extrinsic/sign' \
        -H 'accept: application/json' \
        -H 'Authorization: Seed //Alice' \
        -H 'Content-Type: application/json' \
        -d '{
          "signerPayloadJSON": {
            "specVersion": "0x000e0da8",
            "address": "yGHXkYLYqxijLKKfd9Q2CB9shRVu8rPNBS53wvwGTutYg4zTg",
            "blockHash": "0xf4735c218e3fa7aa6f943cb09d69261c4a036c741bd3525a719a1a7fd28c86a0",
            "blockNumber": "0x000f3aea",
            "era": "0xa400",
            "genesisHash": "0xcd4d732201ebe5d6b014edda071c4203e16867305332301dc8d092044b28e554",
            "method": "0x3d13008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4801000000800d000001000000000000000000000000000000",
            "nonce": "0x00000000",
            "signedExtensions": [
              "CheckSpecVersion",
              "CheckGenesis",
              "CheckMortality",
              "CheckNonce",
              "CheckWeight",
              "ChargeTransactionPayment"
            ],
            "tip": "0x00000000000000000000000000000000",
            "transactionVersion": "0x00000001",
            "version": 4
          },
          "signerPayloadRaw": {
            "address": "yGHXkYLYqxijLKKfd9Q2CB9shRVu8rPNBS53wvwGTutYg4zTg",
            "data": "0x3d13008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4801000000800d000001000000000000000000000000000000a4000000a80d0e00cd4d732201ebe5d6b014edda071c4203e16867305332301dc8d092044b28e554f4735c218e3fa7aa6f943cb09d69261c4a036c741bd3525a719a1a7fd28c86a0",
            "type": "payload"
          },
          "signerPayloadHex": "0x3d13008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4801000000800d000001000000000000000000000000000000a4000000a80d0e00cd4d732201ebe5d6b014edda071c4203e16867305332301dc8d092044b28e554f4735c218e3fa7aa6f943cb09d69261c4a036c741bd3525a719a1a7fd28c86a0"
        }'  
  ```

#### Submit transaction

Merge responses from two previous operations and send it to `/extrinsic/submit`

```shell
    curl -X 'POST' \
        'https://web-quartz.unique.network/extrinsic/sign' \
        -H 'accept: application/json' \
        -H 'Authorization: Seed //Alice' \
        -H 'Content-Type: application/json' \
        -d '{
          "signerPayloadJSON": {
            "specVersion": "0x000e0da8",
            "address": "yGHXkYLYqxijLKKfd9Q2CB9shRVu8rPNBS53wvwGTutYg4zTg",
            "blockHash": "0xf4735c218e3fa7aa6f943cb09d69261c4a036c741bd3525a719a1a7fd28c86a0",
            "blockNumber": "0x000f3aea",
            "era": "0xa400",
            "genesisHash": "0xcd4d732201ebe5d6b014edda071c4203e16867305332301dc8d092044b28e554",
            "method": "0x3d13008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4801000000800d000001000000000000000000000000000000",
            "nonce": "0x00000000",
            "signedExtensions": [
              "CheckSpecVersion",
              "CheckGenesis",
              "CheckMortality",
              "CheckNonce",
              "CheckWeight",
              "ChargeTransactionPayment"
            ],
            "tip": "0x00000000000000000000000000000000",
            "transactionVersion": "0x00000001",
            "version": 4
          },
          "signerPayloadRaw": {
            "address": "yGHXkYLYqxijLKKfd9Q2CB9shRVu8rPNBS53wvwGTutYg4zTg",
            "data": "0x3d13008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4801000000800d000001000000000000000000000000000000a4000000a80d0e00cd4d732201ebe5d6b014edda071c4203e16867305332301dc8d092044b28e554f4735c218e3fa7aa6f943cb09d69261c4a036c741bd3525a719a1a7fd28c86a0",
            "type": "payload"
          },
          "signerPayloadHex": "0x3d13008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4801000000800d000001000000000000000000000000000000a4000000a80d0e00cd4d732201ebe5d6b014edda071c4203e16867305332301dc8d092044b28e554f4735c218e3fa7aa6f943cb09d69261c4a036c741bd3525a719a1a7fd28c86a0",
          "signature": "0x0152efcc1121089aa5e8d0850c6cd55f56cd236afa1a67f694217de2909356da1adffcfceeb59e1b118cc8d521cd51b219e1626bd0a2e4c47fb03f81ae53f63084",
          "signatureType: "sr25519"
        }'  
  ```

</details>


---

