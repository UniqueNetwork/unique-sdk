import {
  ValidationPipe,
  PipeTransform,
  ArgumentMetadata,
  Type,
} from '@nestjs/common';
import { ValidationError } from '@unique-nft/sdk/errors';

export function createValidationPipe(expectedType?: Type) {
  return new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (errors) => ValidationError.wrapError(null, errors),
    expectedType,
  });
}

export const SdkValidationPipe = createValidationPipe();

class ValidationOneOfPipe implements PipeTransform {
  private readonly pipes: Array<ValidationPipe>;

  constructor(private readonly expectedTypes: Type[]) {
    this.pipes = expectedTypes.map(
      (expectedType) =>
        new ValidationPipe({
          transform: true,
          transformOptions: { enableImplicitConversion: true },
          exceptionFactory: (errors) => ValidationError.wrapError(null, errors),
          expectedType,
        }),
    );
  }

  async transform(value: unknown, metadata: ArgumentMetadata) {
    for (let i = 0; i < this.pipes.length; i += 1) {
      const pipe = this.pipes[i];
      try {
        // eslint-disable-next-line no-await-in-loop
        return await pipe.transform(value, metadata);
        // eslint-disable-next-line no-empty
      } catch (err) {}
    }

    return true;
  }
}

export function createValidationPipeOneOf(...expectedTypes: Type[]) {
  return new ValidationOneOfPipe(expectedTypes);
}
