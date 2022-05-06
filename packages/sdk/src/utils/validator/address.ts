const { decodeAddress, encodeAddress } = require('@polkadot/keyring');
const { hexToU8a, isHex } = require('@polkadot/util');
import { registerDecorator, ValidationOptions } from 'class-validator';

export function ValidAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'NotYourselfAddress',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
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
