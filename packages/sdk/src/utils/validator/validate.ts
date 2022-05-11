import { validate as classValidate } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from '../../lib/errors';

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
