<div align="center">
    <img width="400px" src="../../doc/logo-white.svg" alt="Unique Network">
<br/>
<br/>

[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
[![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/)
![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/web?style=flat-square)
![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-sdk?style=flat-square)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
![GitHub](https://img.shields.io/github/v/tag/uniquenetwork/unique-sdk?style=flat-square)
[![stability-alpha](https://img.shields.io/badge/stability-alpha-f4d03f.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#alpha)

</div>

# Web Readme

# Table of Contents

- [Intro](#intro)
- [Getting started](#sdk-deployment---getting-started-guide)
  - [Install](#install)
  - [Environment Variables](#environment-variables)
- [Swagger](#swagger)
- [Mutation methods](#mutation-methods)
- [IPFS](#using-ipfs-for-uploading-files)

## Intro

Extrinsic is a request to change data in the blockchain.

https://docs.substrate.io/v3/concepts/extrinsics/

https://polkadot.js.org/docs/substrate/extrinsics/

To make changes to the blockchain, it is necessary to form a request (extrinsic) with certain parameters, which consists of 3 parts:
1) Blockchain section
2) Method section
3) Array of arguments

Once an extrinsic has been generated, it must be signed in order for the chain to complete the requested changes.


## SDK Deployment - Getting Started Guide


- [How to install](#install)
- [How to configure – environment variables](#environment-variables)
- [Where to try - Swagger](#swagger)

### Install
Choose install approach: [Docker](#docker), [Source code](#git) or [Public endpoints](#public-endpoints)

#### Docker

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

#### Public endpoints

You can use public endpoints for access Unique Web:

#### Opal
```
https://web-opal.unique.network
```

#### Quartz
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

##### Use `SIGNER_SEED` for [sign](#sign-an-extrinsic) method
```bash
SIGNER_SEED=type mnemonic here
SIGNER_SEED=//Alice
```

##### Port (default 3000)
```bash
PORT=3000
```

##### IPFS Gateway
```bash
IPFS_GATEWAY_URL=https://ipfs.unique.network/ipfs/
```

##### Cache manager
Extrinsics cache time:
```bash
CACHE_TTL=600
```

To set up the Redis store to cache extrinsics:
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

##### Secondary endpoints

You can also use a secondary connection for the kusama network or polkadot, which allows you to use secondary endpoints.

KSM endpoints
```
https://web.uniquenetwork.dev/swagger/ksm/
```
Polkadot endpoints
```
https://web-quartz.unique.network/swagger
```


## Swagger

```
https://web-quartz.unique.network/swagger
```

## Mutation methods

Unique SDK allows using mutation methods for updating the state of the blockchain. It supports the entire sequence of actions:
  - Building an extrinsic
  - Signing an extrinsic
  - Signing verification
  - Submitting an extrinsic
  - Checking extrinsic status

Read more about mutation methods in <a href="../packages/sdk#mutation-and-query-methods">SDK documentation</a>.


## Using IPFS for uploading files

You can use IPFS nodes (your private nodes or [public gateway](#ipfs-gateway)) for uploading files to the blockchain.


### Uploading files via IPFS
```
POST /ipfs/upoad-file
```
This method uploads a chosen file as a single file.

<a href="https://web-quartz.unique.network/swagger/#/ipfs/IpfsController_uploadFile">Upload file on Swagger</a>

### Upload zip via IPFS
```
POST /ipfs/upoad-zip
```

This method uploads a zip archive as a folder containing files.

<a href="https://web-quartz.unique.network/swagger/#/ipfs/IpfsController_uploadZip">Upload zip file on Swagger</a>

