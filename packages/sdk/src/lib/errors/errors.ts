import { SdkErrorCodes } from './codes';
import { SdkErrorInfo, getErrorInfo } from './loader';

export class SdkError extends Error {
  readonly code: SdkErrorCodes;
  readonly info?: SdkErrorInfo;
  readonly values?: Record<string, any>;

  constructor(code: SdkErrorCodes, values?: Record<string, any>) {
    const info = getErrorInfo(code);
    super(info.description);
    this.code = code;
    this.info = info;
    this.values = values;
  }
}
