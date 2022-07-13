import { UnsignedTxPayloadResponse, SubmitTxBody } from './types/Api';

export const isUnsignedTxPayloadResponse = (
  args: unknown,
): args is UnsignedTxPayloadResponse =>
  typeof args === 'object' && !!args && 'signerPayloadJSON' in args;

export const isSubmitTxBody = (args: unknown): args is SubmitTxBody =>
  isUnsignedTxPayloadResponse(args) && !!args && 'signature' in args;

export function sleep(ms: number) {
  return new Promise((resolve) => {
    // @ts-ignore
    setTimeout(resolve, ms);
  });
}
