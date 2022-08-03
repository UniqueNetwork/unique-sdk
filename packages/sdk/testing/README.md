
# envs
 * `TEST_CHAIN_WS_URL` - ссылка на чейн, в котором будут проходить тесты
 * `TEST_RICH_ACCOUNTS` - seed аккаунтов с деньгами (через запятую)
 * `TEST_POOR_ACCOUNT` - seed аккаунта без денег
 * `TEST_SHOW_LOG` - по умолчанию тесты не показывают логи/варнинги, чтобы включить их отображение, необходим параметр `TEST_SHOW_LOG=true`

В качестве аккаунта можно передать как uri (`//Alice`, `//Bob`, ...) тестового аккаунта, так и mnemonic фразу реального аккаунта. 

# Создание sdk
```typescript
import { createSdk } from '@unique-nft/sdk/testing';
const withSigner = true;
const sdk = await createSdk(withSigner);
```
Если передать в конструктор `true` - тогда внутри sdk будет создан `signer` аккаунта `TEST_RICH_ACCOUNT`.

# Создание тестовых аккаунтов
Для тестирования используются три тестовых аккаунта, которые создаются из seed переданных в envs. Получить тестовые аккаунты можно с помощью методов:
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

Тестовые аккаунты должны быть созданы после `Sdk` или после вызова `await cryptoWaitReady();`.

# Пример теста перевода баланса
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
