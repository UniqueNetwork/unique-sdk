# Signers
With this package you can create a signer to sign your extrinsics

- [Sign with seed](#Sign-with-seed)
- [Sign with keyfile](#Sign-with-keyfile)
- [Sign with Polkadot extension](#Sign-with-Polkadot-extension)

## Sign with seed

```typescript
import { createSigner, SignerOptions, SdkSigner } from '@unique-nft/accounts/sign';

const signerOptions: SignerOptions = {
  seed: '//Alice'
}
const signer: SdkSigner = signerOptions(signerOptions);
```

## Sign with keyfile

```typescript
import { createSigner, SignerOptions, SdkSigner } from '@unique-nft/accounts/sign';

const signerOptions: SignerOptions = {
  keyfile: <your json keyfile>
}
const signer: SdkSigner = signerOptions(signerOptions);
```

## Sign with Polkadot extension

You can see an example [here](./polkadot/)
