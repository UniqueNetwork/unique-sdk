import {InvalidTransactionError} from "./invalid-transaction";

export enum ErrorCodes {
  BadSignature = 'UN01001',
  InvalidTransaction = 'UN01002',
  UserDataDeserializeError = 'UN01003',
  InvalidParameter = 'UN02001',
}
