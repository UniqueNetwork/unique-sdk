<div align="center">
    <img width="400px" src="https://raw.githubusercontent.com/UniqueNetwork/unique-sdk/ab6b4e524f008d5e921026599de5bc120a91e14e/doc/logo-white.svg" alt="Unique Network">
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

# Client

# Table of Contents

- [About Client package](#about-client-package)
- [Installation](#installation)
- [Initialize](#initialization)
- [Method call](#method-call-examples)


## About Client package

The @unique-nft/client package implements the SDK methods via the REST API. The package implements all the basic methods for working with the SDK:

- collection creating;
- token minting and transferring;
- balance transferring
- etc.

The package is under construction. Check the [SDK package methods list](../../packages/sdk/tokens) to learn more about the methods, that will be implemented in the @unique-nft/client package.

## Installation
### npm
```
npm i @unique-nft/client
```

## Initialization

### Node.js
```
import { Client, Options, AllBalancesResponse, ExtrinsicResultResponse, BalanceTransferParsed } from ‘@unique-nft/client’;
const options: Options = {
    baseUrl: ‘url for rest api’
};
const client = new Client(options);
```

## Method call examples

```
const balanceResponse: AllBalancesResponse = await client.balance.get(
  {
   address: ‘your address’,
  });
```

```
const transferResult: ExtrinsicResultResponse<BalanceTransferParsed> = await client.balance.transfer.submitWaitResult(
  {
    address: ‘address from’,
    destination: ‘address to’,
    amount: 0.001,
  });
```
