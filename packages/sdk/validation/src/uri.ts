import { registerDecorator, ValidationOptions } from 'class-validator';

const uriRegEx = /^\/\/\w+$/;
export function ValidUri(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'Uri',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: (value: string) => uriRegEx.test(value),
      },
    });
  };
}
