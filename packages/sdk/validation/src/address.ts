import { registerDecorator, ValidationOptions } from 'class-validator';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

export function ValidAddress(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'NotYourselfAddress',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        validate: (value: any) => {
          if (!value) return false;
          try {
            // todo optimize address validator
            encodeAddress(
              isHex(value) ? hexToU8a(value) : decodeAddress(value),
            );
            return true;
          } catch (error) {
            return false;
          }
        },
      },
    });
  };
}
