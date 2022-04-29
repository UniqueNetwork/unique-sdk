import { ApiPromise } from '@polkadot/api';
import {
  SignerPayloadRaw,
  SignerPayloadJSON,
} from '@polkadot/types/types/extrinsic';
import { HexString } from '@polkadot/util/types';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import { BadSignatureError } from './errors';

// todo helper per file? helpers as @unique-nft/sdk/helpers ... @unique-nft/sdk/helpers/get_signer_payload_hex ...
export const getSignerPayloadHex = (
  api: ApiPromise,
  signerPayloadRaw: SignerPayloadRaw,
): HexString => {
  const rawPayloadDataU8a = hexToU8a(signerPayloadRaw.data);

  if (rawPayloadDataU8a.length > 256) {
    const payloadHash = api.registry.hash(rawPayloadDataU8a);

    return u8aToHex(payloadHash);
  }

  return signerPayloadRaw.data as HexString;
};

export const getSignerPayloadRaw = (
  api: ApiPromise,
  signerPayloadJSON: SignerPayloadJSON,
): SignerPayloadRaw => {
  const rawPayloadDataU8a = api.registry
    .createType('ExtrinsicPayload', signerPayloadJSON, {
      version: signerPayloadJSON.version,
    })
    .toU8a({ method: true });

  return {
    address: signerPayloadJSON.address,
    data: u8aToHex(rawPayloadDataU8a),
    type: 'payload',
  };
};

export const verifyTxSignature = (
  api: ApiPromise,
  signerPayloadJSON: SignerPayloadJSON,
  signature: HexString,
): void => {
  const signerPayloadRaw = getSignerPayloadRaw(api, signerPayloadJSON);
  const signerPayloadHex = getSignerPayloadHex(api, signerPayloadRaw);

  try {
    const verifyResult = signatureVerify(
      signerPayloadHex,
      signature,
      signerPayloadJSON.address,
    );

    if (verifyResult.isValid) return;
  } catch (error) {
    const errorMessage =
      error && error instanceof Error ? error.message : undefined;
    throw new BadSignatureError(errorMessage);
  }

  throw new BadSignatureError();
};
