# Get fungible tokens balance

Returns amount of fungible tokens owned by address.

## Arguments

- **collectionId** - ID of the collection
- **address** - address

## Returns

- **raw** - raw tokens amount
- **decimals** - decimal part in fungible collection
- **amount** - tokens amount (raw / decimal ** 10)
- **unit** - collection token prefix
- **formatted** - pretty formatted amount with SI

## Examples

```typescript
const accountBalance = await sdk.fungible.getBalance({ collectionId: 123, address: '<address>' });
const { formatted, unit } = accountBalance;

console.log(`Balance is ${formatted}${unit}`); // 'Balance is 100.0000 mTEST'
```
