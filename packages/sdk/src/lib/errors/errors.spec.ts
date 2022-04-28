import { SdkError } from './errors';
import { SdkErrorCodes } from './codes';

describe('error type', () => {
  it('bad signature', () => {
    const error = new SdkError(SdkErrorCodes.BAD_SIGNATURE);
    expect(error.message).toEqual('Bad signature');
    expect(error.info?.description).toEqual('Bad signature');
  });
});
