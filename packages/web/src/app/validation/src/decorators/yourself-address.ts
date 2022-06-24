import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

// todo - encode address to same SS58 ?
export function NotYourselfAddress(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'NotYourselfAddress',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value !== relatedValue;
        },
      },
    });
  };
}
