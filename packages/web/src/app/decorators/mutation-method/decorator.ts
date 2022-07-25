import * as process from 'process';
import { applyDecorators, Body, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiResponse,
  getSchemaPath,
  ApiExtraModels,
  ApiOperation,
} from '@nestjs/swagger';
import { MutationOptions as SdkMutationOptions } from '@unique-nft/sdk/extrinsics';
import {
  Balance,
  SdkSigner,
  SubmittableResultInProcess,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { Signer } from '../signer.decorator';
import { createValidationPipe } from '../../validation';
import { UnsignedTxPayloadResponse } from '../../types/sdk-methods';
import {
  MutationMethodOptions,
  MutationMethodQuery,
  MutationUse,
  SignResponse,
  SubmitResponse,
} from './types';
import { ExtrinsicResultResponse } from '../../types/extrinsic-result-response';
import {
  cacheErrorResult,
  cachePendingResult,
  cacheSerializeResult,
} from '../../utils/cache';

const useSign = async (
  methodOptions: MutationMethodOptions,
  buildResult: UnsignedTxPayload,
  mutationOptions: SdkMutationOptions,
  fee?: Balance,
) => {
  const { mutationMethod } = methodOptions;

  const signResult = await mutationMethod.sign(buildResult, mutationOptions);
  return {
    ...signResult,
    fee,
  };
};

const useSubmit = async (
  methodOptions: MutationMethodOptions,
  buildResult: UnsignedTxPayload,
  mutationOptions: SdkMutationOptions,
  fee?: Balance,
) => {
  const { mutationMethod } = methodOptions;

  const { hash } = await mutationMethod.submit(buildResult, mutationOptions);
  return {
    hash,
    fee,
  };
};

const useSubmitWatch = async (
  methodOptions: MutationMethodOptions,
  buildResult: UnsignedTxPayload,
  mutationOptions: SdkMutationOptions,
  fee?: Balance,
) => {
  const { sdk, mutationMethod, cache } = methodOptions;

  const { hash, result$ } = await mutationMethod.submitWatch(
    buildResult,
    mutationOptions,
  );

  const updateCache = async (
    next: SubmittableResultInProcess<any> | Error,
  ): Promise<void> => {
    if (next instanceof Error) {
      await cache.set<ExtrinsicResultResponse<any>>(
        hash,
        cacheErrorResult(next, fee),
      );

      return;
    }

    await cache.set<ExtrinsicResultResponse>(
      hash,
      cacheSerializeResult(sdk.api, next.submittableResult, next.parsed, fee),
    );
  };

  await cache.set<ExtrinsicResultResponse>(hash, cachePendingResult(fee));

  result$.subscribe({
    next: updateCache,
    error: updateCache,
  });

  return {
    hash,
    fee,
  };
};

const useResult = async (
  methodOptions: MutationMethodOptions,
  buildResult: UnsignedTxPayload,
  mutationOptions: SdkMutationOptions,
  fee?: Balance,
) => {
  if (process.env.ALLOW_WAIT_RESULT !== 'true') {
    throw new Error('Request with use=result parameter not available');
  }

  const { mutationMethod } = methodOptions;

  const { submittableResult, parsed } = await mutationMethod.submitWaitResult(
    buildResult,
    mutationOptions,
  );

  return {
    isError: submittableResult.isError,
    parsed,
    fee,
  };
};

const useMethods = {
  [MutationUse.Sign]: useSign,
  [MutationUse.Submit]: useSubmit,
  [MutationUse.SubmitWatch]: useSubmitWatch,
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
  const decorators: MethodDecorator[] = [
    ApiBody({ type: bodyArgsClass }),
    ApiQuery({ type: MutationMethodQuery }),
    ApiBearerAuth('SeedAuth'),
    ApiOperation({ operationId: propertyKey }),
    httpMethodDecorator,
    ApiResponse({
      schema: {
        oneOf: [
          { $ref: getSchemaPath(UnsignedTxPayloadResponse) },
          { $ref: getSchemaPath(SignResponse) },
          { $ref: getSchemaPath(SubmitResponse) },
          { $ref: getSchemaPath(resultClass) },
        ],
      },
    }),
    ApiExtraModels(
      UnsignedTxPayloadResponse,
      SignResponse,
      SubmitResponse,
      bodyArgsClass,
      resultClass,
    ),
  ];

  if (!descriptor.value.name) {
    decorators.push(ApiOperation({ operationId: propertyKey }));
  }

  applyDecorators(...decorators)(target, propertyKey, descriptor);
};

const createMutationCallback = (target, propertyKey) => {
  const original = target[propertyKey];

  return async function (body, query: MutationMethodQuery, signer?: SdkSigner) {
    const methodOptions: MutationMethodOptions = original.call(this);

    const { mutationMethod } = methodOptions;

    const buildResult = await mutationMethod.build(body);

    let fee;
    if (query.withFee) {
      fee = await mutationMethod.getFee(buildResult);
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

    return useMethods[query.use](
      methodOptions,
      buildResult,
      mutationOptions,
      fee,
    );
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
    const queryPipe = createValidationPipe(MutationMethodQuery);

    Body(bodyPipe)(target, propertyKey, 0);
    Query(queryPipe)(target, propertyKey, 1);
    Signer()(target, propertyKey, 2);

    return descriptor;
  };
