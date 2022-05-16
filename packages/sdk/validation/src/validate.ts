import { validateSync as classValidate } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from '@unique-nft/sdk/errors';

export function validate<T extends object>(plain: T, cls: ClassConstructor<T>) {
  const value: T = plainToInstance(cls, plain);
  const errors = classValidate(value);
  if (errors.length) {
    throw new ValidationError(errors);
  }
}
