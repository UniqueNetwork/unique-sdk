<div align="center">
<img src="https://github.com/UniqueNetwork/marketplace-docker/raw/master/doc/logo-white.svg" alt="Unique White Label Market">
</div>

[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org) [![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/) ![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/marketplace-frontend?style=flat-square) ![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-marketplace-frontend?style=flat-square) ![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
<!-- ![GitHub Release Date](https://img.shields.io/github/release-date/uniquenetwork/unique-marketplace-frontend?style=flat-square)
![GitHub](https://img.shields.io/github/v/tag/uniquenetwork/unique-marketplace-frontend?style=flat-square) -->

# Intro

This SDK is intended for web project owners and developers whose goal is to implement main UniqueNetwork functions to their website without building their own infrastructure.
This SDK is an npm package that contains all the necessary logic for implementation.

## Table of Contents

- [Getting started](#how-to-start)
- [Packages](#Packages)
	- [Web](#Web-(Gate))
	- [Recipes](#Resipes)
	- [SDK](#SDK)

# How to start
Use <a href="https://github.com/UniqueNetwork/unique-sdk/blob/master/packages/web/README.md#sdk-deployment---getting-started-guide">SDK Deployment guide</a> to install SDK. You can use <a href="https://github.com/UniqueNetwork/unique-sdk/blob/master/packages/web/README.md#docker">Docker</a>, <a href="https://github.com/UniqueNetwork/unique-sdk/blob/master/packages/web/README.md#git">Git</a> or <a href="https://github.com/UniqueNetwork/unique-sdk/blob/master/packages/web/README.md#public-endpoints">Public endpoints</a>.



# Packages


## Web (Gate)
If your project doesn't use js and you need to implement server logic, use <a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/web">web (gate) package</a>.
Web (gate) package is created to make a request (extrinsic) with certain parameter to make changes to the blockchain. Also this package allowes to upload images useng IPFS.
Use <a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/web#readme">web package documentation</a> to learn its methods.
Web (gate) package can be used with existing public nodes or with your own pricate nodes.

## Recipes

Use <a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/recipes">recipes folder</a> to learn some useful hints or life hacks that will ease using of SDK.


## SDK
<a href="https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/sdk">SDK folder</a> contains npm package of SDK itself.

