<div align="center">
<img src="https://github.com/UniqueNetwork/marketplace-docker/raw/master/doc/logo-white.svg" alt="Unique White Label Market">
</div>

[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org) [![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/) ![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/marketplace-frontend?style=flat-square) ![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-marketplace-frontend?style=flat-square) ![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
<!-- ![GitHub Release Date](https://img.shields.io/github/release-date/uniquenetwork/unique-marketplace-frontend?style=flat-square)
![GitHub](https://img.shields.io/github/v/tag/uniquenetwork/unique-marketplace-frontend?style=flat-square) -->

# Intro

The SDK is intended for developers whose goal is to implement Unique Network functions avoiding working with a low-level blockchain API.
This SDK may be used as an npm package or REST API.

## Table of Contents

- [Getting started](#how-to-start)
- [Packages](#Packages)
 	- [SDK](#SDK)
	- [Web](#Web)
	- [Recipes](#Resipes)

# How to start
Add SDK to your JavaScript/TypeScript project with

    npm install @unique-nft/sdk
or deploy your own SDK as HTTP REST Service with

    docker run uniquenetwork/web:latest
You can also use <a href="https://github.com/UniqueNetwork/unique-sdk/blob/master/packages/web/README.md#public-endpoints">Public endpoints</a>.
To learn more read <a href="https://github.com/UniqueNetwork/unique-sdk/blob/master/packages/web/README.md#sdk-deployment---getting-started-guide">SDK Deployment guide</a>:  <a href="https://github.com/UniqueNetwork/unique-sdk/blob/master/packages/web/README.md#docker">Docker</a>, <a href="https://github.com/UniqueNetwork/unique-sdk/blob/master/packages/web/README.md#git">Git</a>.

# Packages

## SDK
<a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk">SDK package</a> contains npm package of SDK itself.

## Web
As an alternative to the whole SDK you can use proxy http serviсe for SDK to implement server logic - <a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/web">HTTP API Service</a>.
HTTP API Service is created to connect to blockcahin using simple HTTP requests.
In general HTTP API Service provides folowing fuctions:

 1. <a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/web#build-unsigned-extrinsic">Building an unsigned extrinsic</a>
 2. <a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/web#sign-an-extrinsic">Extrinsic signing and verification using service</a> (These functions should be implemented on client for safety)
 3. <a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/web#Submit-extrinsic">Submitting an extrinsic</a>

HTTP API Service also allows to upload images using IPFS.
Use <a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/web#readme">HTTP API Service documentation</a> to learn its methods.
HTTP API Service can be used with existing public nodes or with your own private nodes.

## Recipes
<a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/recipes">Here</a> you can find some useful hints or life hacks that will ease using of SDK.