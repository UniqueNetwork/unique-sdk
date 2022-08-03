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

# How to test the SDK

# Table of Contents

- [Envs](#envs)
- [SDK Installation](#sdk-installation)
- [Creation of test accounts](#creation-of-test-accounts)
- [Examples](#examples)

## envs

 * `TEST_CHAIN_WS_URL` - blockchain URL, in which the test will be run
 * `TEST_RICH_ACCOUNTS` - seed of accounts with money (use a comma as a separator)
 * `TEST_POOR_ACCOUNT` - seed of account without money
 * `TEST_SHOW_LOG` - by default logs and warnings are off; to enable them use `TEST_SHOW_LOG=true`

As an account, you can send the URI (`//Alice`, `//Bob`, ...) or the mnemonic phrase of the real account.

## SDK Installation

```typescript
import { createSdk } from '@unique-nft/sdk/testing';
const withSigner = true;
const sdk = await createSdk(withSigner);
```

If you send `true` to the constructor, then a `signer` account `TEST_RICH_ACCOUNT` will be created inside the SDK.

## Creation of test accounts

Three test accounts are used for testing, which are created from the seed passed to envs. You can get test accounts using the following methods:

```typescript
import {
  createRichAccount,
  createPoorAccount,
  createAnotherAccount,
  TestAccount,
} from '@unique-nft/sdk/testing';
const richAccount: TestAccount = createRichAccount();
const poorAccount: TestAccount = createPoorAccount();
const anotherAccount: TestAccount = createAnotherAccount();
```

Test accounts must be created after `Sdk` or after calling `await cryptoWaitReady();`.

## Examples

### Balance transfer example

```typescript
describe('balance-transfer', () => {
  it('ok', async () => {
    const sdk: Sdk = await createSdk(true);
    
    const richAccount = createRichAccount();
    const poorAccount = createPoorAccount();
    
    const { isCompleted, parsed } = await sdk.balance.transfer.submitWaitResult(
      {
        address: richAccount.address,
        destination: poorAccount.address,
        amount: 0.01,
      },
    );

    expect(isCompleted).toBe(true);
    expect(parsed.success).toBe(true);
  }, 30_000);
});
```
