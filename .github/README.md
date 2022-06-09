
<div align="center">
<img src="https://github.com/UniqueNetwork/marketplace-docker/raw/master/doc/logo-white.svg" alt="Unique White Label Market">
</div>

[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org) [![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/) ![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/marketplace-frontend?style=flat-square) ![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-marketplace-frontend?style=flat-square) ![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
<!-- ![GitHub Release Date](https://img.shields.io/github/release-date/uniquenetwork/unique-marketplace-frontend?style=flat-square)
![GitHub](https://img.shields.io/github/v/tag/uniquenetwork/unique-marketplace-frontend?style=flat-square) -->

# Intro

This SDK is intended for web project owners and developers whose goal is to implement main UniqueNetwork functions to their projects without difficult blockchain connection logic.
This SDK is an npm package that contains all the necessary logic for implementation.

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
As an alternative to the whole SDK you can use proxy http serviсe for SDK to implement server logic - <a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/web">web service</a>.
Web service is created to make a request (extrinsic) with certain parameter to make changes to the blockchain. It also allows to upload images using IPFS.
Use <a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/web#readme">web service documentation</a> to learn its methods.
Web  package can be used with existing public nodes or with your own private nodes.

## Recipes
<a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/recipes">Here</a> you can find some useful hints or life hacks that will ease using of SDK.