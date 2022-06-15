import {
  ErrorCodes,
  SdkError,
  SubmitExtrinsicError,
} from '@unique-nft/sdk/errors';

describe('Sdk errors', () => {
  const superError = new SdkError(
    'foo',
    'bar baz',
    ErrorCodes.SubmitExtrinsic,
    SubmitExtrinsicError.name,
  );

  const wrappedError = SubmitExtrinsicError.wrapError(
    new Error('foo'),
    'bar baz',
  );

  const simpleError = new SubmitExtrinsicError('foo', 'bar baz');

  const checkError = (name: string, error: SdkError) => {
    expect(error.name).toEqual(SubmitExtrinsicError.name);
    expect(error.code).toEqual(ErrorCodes.SubmitExtrinsic);
    expect(error.message).toEqual('foo');
    expect(error.details).toEqual('bar baz');
  };

  it.each([
    ['simpleError', simpleError],
    ['superError', superError],
    ['wrappedError', wrappedError],
  ])('%s', checkError);
});
