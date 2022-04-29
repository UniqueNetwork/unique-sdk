enum ErrorCodes {
  BadSignature = 'UN01001',
  InvalidParameter = 'UN02001',
}

export class SdkError extends Error {
  constructor(
    public readonly code: ErrorCodes,
    name: string,
    message?: string,
  ) {
    super(message);
    this.name = name;
  }
}

export class BadSignatureError extends SdkError {
  constructor(message = BadSignatureError.name) {
    super(ErrorCodes.BadSignature, BadSignatureError.name, message);
  }
}
