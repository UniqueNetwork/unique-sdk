# Metamask provider
Провайдер [Metamask расширение](https://metamask.io/download/) для браузера. 

## Пример
```typescript
import { Account } from '@unique-nft/accounts';
import { MetamaskProvider } from '@unique-nft/accounts/metamask';

const provider = new MetamaskProvider();
await provider.init();

const account: Account | undefined = await provider.first();

const signer = account?.getSigner();
```
