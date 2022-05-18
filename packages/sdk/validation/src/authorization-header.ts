import { registerDecorator, ValidationOptions } from 'class-validator';

export function ValidAuthorizationHeader(
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'AuthorizationHeader',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        // todo auth header validator
        validate: (value: string) => true,
      },
    });
  };
}
