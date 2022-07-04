
# Signing with Polkadot extension
You can use the polkadot extension to sign your extrinsics

## Example

```typescript
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { PolkadotSigner } from "@unique-nft/accounts/sign/polkadot";

const signerOptions = {
  chooseAccount: (accounts: InjectedAccountWithMeta[]): Promise<InjectedAccountWithMeta> => {
    return Promise.resolve(accounts[0]);
  },
};
const signer = new PolkadotSigner(signerOptions);

const options: SdkOptions = {
  chainWsUrl: '<chain url>',
  signer,
};
const sdk = await Sdk.create(options);
```
