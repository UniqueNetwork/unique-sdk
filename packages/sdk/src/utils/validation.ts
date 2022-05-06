import { validate } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { DataValidateError } from '../lib/errors';

export async function validateValue<T>(cls: ClassConstructor<T>, plain: T) {
  const value: any = plainToInstance(cls, plain);
  const errors = await validate(value);
  if (errors.length) {
    throw new DataValidateError();
  }
}
