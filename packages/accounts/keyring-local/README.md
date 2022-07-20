# KeyringLocal provider
Провайдер работает напрямую с чейном используя `KeyringPair`, сохраняя при этом аккаунты в локальном хранилище, используя пакет `@polkadot/ui-keyring`.

## Пример
```typescript
import { Account } from '@unique-nft/accounts';
import { KeyringPair } from '@polkadot/keyring/types';
import {
  KeyringLocalOptions,
  KeyringLocalProvider,
} from '@unique-nft/accounts/keyring-local';

const options: KeyringLocalOptions = {
  type: 'sr25519',
  passwordCallback: async (keyring: KeyringPair) => {
    return '<password>';
  },
};
const provider = new KeyringLocalProvider(options);
await provider.init();

provider.addUri('<uri of account>', '<password>');

const account: Account | undefined = await provider.first();

const signer = account?.getSigner();
```
