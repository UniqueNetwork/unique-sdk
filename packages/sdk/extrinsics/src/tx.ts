import { ApiPromise } from '@polkadot/api';
import {
  SignerPayloadRaw,
  SignerPayloadJSON,
} from '@polkadot/types/types/extrinsic';
import { HexString } from '@polkadot/util/types';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import { SignerPayload } from '@polkadot/types/interfaces';
import { BadSignatureError, BadPayloadError } from '@unique-nft/sdk/errors';
import { UnsignedTxPayload } from '@unique-nft/sdk/types';

const getSignerPayloadHex = (
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

const getSignerPayloadRaw = (
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

/*
  todo - check that function fails on signed <wrapBytes> payload with understandable error message
  https://github.com/polkadot-js/extension/pull/743
 */
export const verifyTxSignatureOrThrow = (
  api: ApiPromise,
  signerPayloadJSON: SignerPayloadJSON,
  signature: HexString,
) => {
  let signerPayloadHex = '';

  try {
    const signerPayloadRaw = getSignerPayloadRaw(api, signerPayloadJSON);
    signerPayloadHex = getSignerPayloadHex(api, signerPayloadRaw);
  } catch (error) {
    const errorMessage =
      error && error instanceof Error ? error.message : undefined;

    throw new BadPayloadError(errorMessage);
  }

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

export const signerPayloadToUnsignedTxPayload = (
  api: ApiPromise,
  signerPayload: SignerPayload,
): UnsignedTxPayload => {
  const signerPayloadJSON = signerPayload.toPayload();
  const signerPayloadRaw = signerPayload.toRaw();
  const signerPayloadHex = getSignerPayloadHex(api, signerPayloadRaw);

  return {
    signerPayloadJSON,
    signerPayloadRaw,
    signerPayloadHex,
  };
};
