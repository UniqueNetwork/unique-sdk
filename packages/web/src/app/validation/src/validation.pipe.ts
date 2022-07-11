import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from '@unique-nft/sdk/errors';

export function createValidationPipe(expectedType?: any) {
  return new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (errors) => ValidationError.wrapError(null, errors),
    expectedType,
  });
}

export const SdkValidationPipe = createValidationPipe();
