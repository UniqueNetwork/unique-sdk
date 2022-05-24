import { registerDecorator, ValidationOptions } from 'class-validator';
import { mnemonicValidate } from '@polkadot/util-crypto';

export function ValidMnemonic(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'Mnemonic',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        validate: (value: string) => mnemonicValidate(value),
      },
    });
  };
}
