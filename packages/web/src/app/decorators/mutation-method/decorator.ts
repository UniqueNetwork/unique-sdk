import { applyDecorators, Body, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  MutationMethodWrap,
  MutationOptions as SdkMutationOptions,
} from '@unique-nft/sdk/extrinsics';
import { Balance, SdkSigner, UnsignedTxPayload } from '@unique-nft/sdk/types';
import { Signer } from '../signer.decorator';
import { createValidationPipe } from '../../validation';
import { UnsignedTxPayloadResponse } from '../../types/sdk-methods';
import {
  MutationOptions,
  MutationUse,
  SignResultResponse,
  SubmitResultResponse,
} from './types';

const useSign = async (
  mutation: MutationMethodWrap<any, any>,
  buildResult: UnsignedTxPayload,
  mutationOptions: SdkMutationOptions,
  fee?: Balance,
) => {
  const signResult = await mutation.sign(buildResult, mutationOptions);
  return {
    ...signResult,
    fee,
  };
};

const useSubmit = async (
  mutation: MutationMethodWrap<any, any>,
  buildResult: UnsignedTxPayload,
  mutationOptions: SdkMutationOptions,
  fee?: Balance,
) => {
  const { hash } = await mutation.submit(buildResult, mutationOptions);
  return {
    hash,
    fee,
  };
};

const useResult = async (
  mutation: MutationMethodWrap<any, any>,
  buildResult: UnsignedTxPayload,
  mutationOptions: SdkMutationOptions,
  fee?: Balance,
) => {
  const { isCompleted, parsed } = await mutation.submitWaitResult(
    buildResult,
    mutationOptions,
  );
  return {
    isCompleted,
    parsed,
    fee,
  };
};

const useMethods = {
  [MutationUse.Sign]: useSign,
  [MutationUse.Submit]: useSubmit,
  [MutationUse.Result]: useResult,
};

const applyMutationDecorator = (
  httpMethodDecorator,
  bodyArgsClass,
  resultClass,
  target,
  propertyKey,
  descriptor,
) => {
  applyDecorators(
    ApiBody({ type: bodyArgsClass }),
    ApiQuery({ type: MutationOptions }),
    ApiBearerAuth('SeedAuth'),
    httpMethodDecorator,
    ApiResponse({
      schema: {
        oneOf: [
          { $ref: getSchemaPath(UnsignedTxPayloadResponse) },
          { $ref: getSchemaPath(SignResultResponse) },
          { $ref: getSchemaPath(SubmitResultResponse) },
          { $ref: getSchemaPath(resultClass) },
        ],
      },
    }),
    ApiExtraModels(
      UnsignedTxPayloadResponse,
      SignResultResponse,
      SubmitResultResponse,
      bodyArgsClass,
      resultClass,
    ),
  )(target, propertyKey, descriptor);
};

const createMutationCallback = (target, propertyKey) => {
  const original = target[propertyKey];

  return async function (body, query: MutationOptions, signer?: SdkSigner) {
    const mutation: MutationMethodWrap<any, any> = original.call(this);
    const buildResult = await mutation.build(body);

    let fee;
    if (query.withFee) {
      fee = await mutation.getFee(buildResult);
    }

    if (!query.use || query.use === MutationUse.Build) {
      return {
        ...buildResult,
        fee,
      };
    }

    if (!useMethods[query.use]) {
      throw new Error('Invalid use type');
    }

    if (!signer) {
      throw new Error('Invalid signer');
    }

    const mutationOptions = { signer };

    return useMethods[query.use](mutation, buildResult, mutationOptions, fee);
  };
};

export const MutationMethod = (
  httpMethodDecorator: MethodDecorator,
  bodyArgsClass,
  resultClass,
): MethodDecorator =>
  function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    // eslint-disable-next-line  no-param-reassign
    descriptor.value = createMutationCallback(target, propertyKey);

    applyMutationDecorator(
      httpMethodDecorator,
      bodyArgsClass,
      resultClass,
      target,
      propertyKey,
      descriptor,
    );

    const bodyPipe = createValidationPipe(bodyArgsClass);
    const queryPipe = createValidationPipe(MutationOptions);

    Body(bodyPipe)(target, propertyKey, 0);
    Query(queryPipe)(target, propertyKey, 1);
    Signer()(target, propertyKey, 2);

    return descriptor;
  };
