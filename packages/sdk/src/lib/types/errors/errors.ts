import fs from 'fs';
import { SdkErrorCodes } from './codes';

export * from './codes';

export class SdkError extends Error {
  readonly code: SdkErrorCodes;
  readonly info?: SdkErrorInfo;
  readonly values?: Record<string, any>;
  constructor(code: SdkErrorCodes, values?: Record<string, any>) {
    const info = errorsInfoMap.get(code) || defaultErrorInfo;
    super(info.description);
    this.code = code;
    this.info = info;
    this.values = values;
  }
}

interface SdkErrorInfo {
  description: string;
  ru?: string;
}
type SdkErrorsMap = Map<SdkErrorCodes, SdkErrorInfo>;
interface ErrorClassInfo {
  name: string;
  errors: SdkErrorsMap;
}

const defaultErrorInfo: SdkErrorInfo = {
  description: 'Internal error',
};
let errorsInfoMap: SdkErrorsMap;
function loadErrorsInfo() {
  const errorsFile = fs.readFileSync(__dirname + '/info.json', 'utf-8');
  const errorClasses: ErrorClassInfo[] = JSON.parse(errorsFile);
  errorsInfoMap = errorClasses.reduce<SdkErrorsMap>((map, classInfo) => {
    Object.keys(classInfo.errors).forEach((key) => {
      const code = <SdkErrorCodes>key;
      const info = classInfo.errors.get(code);
      if (info) {
        map.set(code, info);
      }
    });
    return map;
  }, new Map<SdkErrorCodes, SdkErrorInfo>());
  Object.values(SdkErrorCodes).forEach((code) => {
    if (!errorsInfoMap.has(code)) {
      throw new Error(`Not found error info, code: ${code}`);
    }
  });
}

try {
  loadErrorsInfo();
} catch (err) {
  console.error('failed to load errors info');
}
