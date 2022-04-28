import { SdkErrorCodes } from './codes';
import * as fs from 'fs';

export interface SdkErrorInfo {
  description: string;
  ru?: string;
}

const defaultErrorInfo: SdkErrorInfo = {
  description: 'Internal error',
};
type SdkErrorsMap = Map<SdkErrorCodes, SdkErrorInfo>;

const errorsFile = fs.readFileSync(__dirname + '/info.json', 'utf-8');
const errorClasses = JSON.parse(errorsFile);
const errorsInfoMap: SdkErrorsMap = errorClasses.reduce(
  (map: SdkErrorsMap, errorClass: any) => {
    Object.keys(errorClass.errors).forEach((key) => {
      const code = <SdkErrorCodes>key;
      const info = errorClass.errors[key];
      map.set(code, info);
    });
    return map;
  },
  new Map<SdkErrorCodes, SdkErrorInfo>(),
);

Object.values(SdkErrorCodes).forEach((code) => {
  if (!errorsInfoMap.has(code)) {
    throw new Error(`Not found error info, code: ${code}`);
  }
  if (!errorsInfoMap.get(code)?.description) {
    throw new Error(`Invalid description in error info, code: ${code}`);
  }
});

export function getErrorInfo(code: SdkErrorCodes): SdkErrorInfo {
  return errorsInfoMap.get(code) || defaultErrorInfo;
}
