import { VerificationFailedError } from '@unique-nft/sdk/errors/src/verification-failed';

export enum ErrorCodes {
  Other = 'UN01000',
  BadSignature = 'UN01001',
  BuildExtrinsic = 'UN01002',
  SubmitExtrinsic = 'UN01003',
  Validation = 'UN01004',
  InvalidSigner = 'UN01005',
  BadPayload = 'UN01006',
  BuildQuery = 'UN01007',
  NotFound = 'UN01008',
  VerificationFailed = 'UN01009',
}
