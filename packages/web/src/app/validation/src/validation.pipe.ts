import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from '@unique-nft/sdk/errors';

export const SdkValidationPipe = new ValidationPipe({
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  exceptionFactory: (errors) => new ValidationError(errors),
});
