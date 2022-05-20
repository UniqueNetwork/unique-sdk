import {
  validate as classValidate,
  validateSync as classValidateSync,
} from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from '@unique-nft/sdk/errors';

export async function validate<T extends object>(
  plain: T,
  cls: ClassConstructor<T>,
) {
  const value: T = plainToInstance(cls, plain);
  const errors = await classValidate(value);
  if (errors.length) {
    throw new ValidationError(errors);
  }
}

export function validateSync<T extends object>(
  plain: T,
  cls: ClassConstructor<T>,
) {
  const value: T = plainToInstance(cls, plain);
  const errors = classValidateSync(value);
  if (errors.length) {
    throw new ValidationError(errors);
  }
}
