# Keyring provider
Провайдер работает напрямую с чейном используя `KeyringPair` из пакета `@polkadot/keyring`.

## Пример
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
provider.addKeyfile('<json keyfile>');

const account: Account | undefined = await provider.first();
const signer = account?.getSigner();
```
