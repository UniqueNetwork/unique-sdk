<div align="center">
    <img width="400px" src="../doc/logo-white.svg" alt="Unique Network">

[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
[![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/)
![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/web?style=flat-square)
![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-sdk?style=flat-square)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
![GitHub Release Date](https://img.shields.io/github/release-date/uniquenetwork/unique-sdk?style=flat-square)
![GitHub](https://img.shields.io/github/v/tag/uniquenetwork/unique-sdk?style=flat-square)
[![stability-alpha](https://img.shields.io/badge/stability-alpha-f4d03f.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#alpha)

</div>

# SDK Readme

# Table of Contents

- [Intro](#intro)
- [Getting started](#how-to-start)
- [Packages](#packages)
  - [SDK](#sdk)
  - [Accounts](#accounts)
  - [Web](#web)
- [Recipes](#recipes)

## Intro

The SDK is intended for developers whose goal is to implement Unique Network functions avoiding working with a low-level blockchain API.
This SDK may be used as an npm package or REST API.

## How to start

Add SDK to your JavaScript/TypeScript project with

    npm install @unique-nft/sdk

or deploy your own SDK as HTTP REST Service with

    docker run uniquenetwork/web:latest

You can also use [Public endpoints](../packages/web#public-endpoints).
To learn more read [SDK Deployment guide](../packages/web#sdk-deployment---getting-started-guide): [Docker](../packages/web#docker), [Git](../packages/web#git).

## Packages

### SDK

[SDK package](../packages/sdk) contains npm package of SDK itself.

### Accounts

[Accounts package](../packages/accounts)

### Web

As an alternative to the whole SDK, you can use proxy http serviсe for SDK to implement server logic - [HTTP API Service](../packages/web).
It is created to interact with the blockchain using simple HTTP requests.
In general, this service provides the following functions:

1.  [Building an unsigned extrinsic](../packages/web#build-unsigned-extrinsic)
2.  [Extrinsic signing and verification using service (These functions should be implemented on client for safety)](../packages/web#sign-an-extrinsic)
3.  [Submitting an extrinsic](../packages/web#Submit-extrinsic)

HTTP API Service also allows to upload images using IPFS, can be used with existing public nodes or with your own private nodes.
Use [service documentation](../packages/web#readme) to learn its methods.

## Recipes

[Here](../recipes) you can find some useful hints or life hacks that will ease using of SDK.
