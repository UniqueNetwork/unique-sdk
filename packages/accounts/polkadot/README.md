# Polkadot provider
Провайдер [Polkadot расширение](https://polkadot.js.org/extension/) для браузера. 

## Пример
```typescript
import { Web3AccountsOptions } from '@polkadot/extension-inject/types';
import { Account } from '@unique-nft/accounts';
import { PolkadotProvider } from '@unique-nft/accounts/polkadot';

const options: Web3AccountsOptions = {
  accountType: ['sr25519'],
};
const provider = new PolkadotProvider(options);
await provider.init();

const account: Account | undefined = await provider.first();

const signer = account?.getSigner();
```
