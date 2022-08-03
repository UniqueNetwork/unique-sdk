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

# Accounts

#  Table of Contents

- [Accounts](#about-accounts)
- [Providers](#providers)
- [Generate new account](#generate-new-account)
- [Get account from mnemonic](#get-account-from-mnemonic)

## About accounts
The package is required to connect different accounts and create signatures for them. To get a list of accounts, you need to create an instance of the Accounts class and connect the necessary providers to it:

```typescript
import { Account, Accounts, SdkSigner } from '@unique-nft/accounts';
import { KeyringLocalProvider } from '@unique-nft/accounts/keyring-local';
import { PolkadotProvider } from '@unique-nft/accounts/polkadot';

const accounts = new Accounts();
await accounts.addProvider(KeyringLocalProvider);
await accounts.addProvider(PolkadotProvider);

const accountsList = await accounts.getAccounts();

const account: Account = accountsList[0];

const signer: SdkSigner = account.getSigner();
```

## Providers

If you need to get an account from one specific provider, then it is not necessary to create an Accounts object, you can contact the provider directly:

```typescript
import { Account } from '@unique-nft/accounts';
import { KeyringProvider } from '@unique-nft/accounts/keyring';
import { KeyringOptions } from '@polkadot/keyring/types';

const options: KeyringOptions = {
  type: 'sr25519',
};
const provider = new KeyringProvider(options);
await provider.init();
provider.addSeed('<seed of account>');

const account: Account | undefined = await provider.first();
const signer = account?.getSigner();
```

The following providers are supported:

* [Keyring](./keyring)
* [KeyringLocal](./keyring-local)
* [Polkadot extension](./polkadot)
* [Metamask extension](./metamask)

## Generate new account

```typescript
import { generateAccount, SignatureType } from "@unique-nft/accounts";

const account = await generateAccount({
  password: '123456',
  pairType: SignatureType.Sr25519,
  meta: {
    name: 'my_test_account'
  }
})
```

## Get account from mnemonic

```typescript
import { getAccountFromMnemonic } from '@unique-nft/accounts';

const account = await getAccountFromMnemonic({
  mnemonic: 'your mnemonic phrase',
});
```
