import { registerDecorator, ValidationOptions } from 'class-validator';
import { mnemonicValidate } from '@polkadot/util-crypto';

export function ValidSeed(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'Seed',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: (value: string) => mnemonicValidate(value),
      },
    });
  };
}
