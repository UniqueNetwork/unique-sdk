import { applyDecorators, Body, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { SdkValidationPipe } from '../../validation';
import { ValidationError } from '@unique-nft/sdk/errors';
import { MutationMethodWrap } from '@unique-nft/sdk/extrinsics';

const AnyToBoolean = Transform(({ obj = {}, key }) => {
  const asString = String(obj && obj[key]).toLowerCase();

  return asString === 'true' || asString === '1';
});

export class MutationOptions {
  @AnyToBoolean
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
  })
  withFee?: boolean;

  @AnyToBoolean
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
  })
  sign?: boolean;
}

export const MutationMethod = (
  httpMethodDecorator: MethodDecorator,
  bodyArgs,
): MethodDecorator => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {

    const original = target[propertyKey];

    descriptor.value = async function(
      body,
      query: MutationOptions,
    ){
      const mutation: MutationMethodWrap<any, any> = original.call(this);
      const result = await mutation.build(body);
      let fee = {};
      if (query.withFee) {
        fee = await mutation.getFee(result);
      }
      return {
        ... result,
        fee,
      };
    }

    applyDecorators(
      ApiBody({ type: bodyArgs }),
      ApiQuery({ type: MutationOptions }),
      httpMethodDecorator,
    )(target, propertyKey, descriptor);

    const queryPipe = new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => ValidationError.wrapError(null, errors),
      expectedType: MutationOptions,
    });

    const bodyPipe = new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => ValidationError.wrapError(null, errors),
      expectedType: bodyArgs,
    });

    Body(bodyPipe)(target, propertyKey, 0);
    Query(queryPipe)(target, propertyKey, 1);

    return descriptor;

  };
}
