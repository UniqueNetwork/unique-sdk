import {
  Body,
  CACHE_MANAGER,
  Controller,
  Inject,
  NotFoundException,
  Query,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';
import { MutationMethodWrap } from '@unique-nft/sdk/extrinsics';
import { SdkSigner, SubmittableResultInProcess } from '@unique-nft/sdk/types';
import { v4 as uuid } from 'uuid';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import {
  UnsignedTxPayloadResponseWithFee,
  WithFeeQuery,
} from '../../types/sdk-methods';
import { Signer } from '../../decorators/signer.decorator';

import { SignTxResultResponse } from '../../types/arguments';
import { ControllerOptions, GetResult, ResultOrError, Status } from './types';
import { getMethodDecorators, GetResultQuery } from './decorators';

export function getControllerClass<A, R>(
  options: ControllerOptions<A, R>,
): Type<any> {
  const {
    sectionPath,
    MutationConstructor,
    inputDto,
    methodPath,
    outputDto,
    tag = sectionPath,
  } = options;

  const { Build, Sign, Submit, Result } = getMethodDecorators(
    methodPath,
    inputDto,
    outputDto,
  );

  @ApiTags(tag)
  @Controller(sectionPath)
  class MutationController {
    private mutation: MutationMethodWrap<A, R>;

    constructor(private sdk: Sdk, @Inject(CACHE_MANAGER) private cache: Cache) {
      this.mutation = new MutationConstructor(sdk);
    }

    @Build
    async build(
      @Query() { withFee }: WithFeeQuery,
      @Body(new ValidationPipe({ expectedType: inputDto })) args: A,
    ): Promise<UnsignedTxPayloadResponseWithFee> {
      const unsignedTx = await this.mutation.build(args);

      if (!withFee) return unsignedTx;

      return {
        ...unsignedTx,
        fee: await this.mutation.getFee(unsignedTx),
      };
    }

    @Sign
    async sign(
      @Body(new ValidationPipe({ expectedType: inputDto })) args: A,
      @Signer() signer?: SdkSigner,
    ): Promise<SignTxResultResponse> {
      const signedTx = await this.mutation.sign(args, { signer });

      // todo
      return {
        ...signedTx,
        signatureType: 'todo - check signed contract' as any,
      };
    }

    @Submit
    async submit(
      @Body(new ValidationPipe({ expectedType: inputDto })) args: A,
      @Signer() signer?: SdkSigner,
    ): Promise<GetResult> {
      const result$ = await this.mutation.submitWatch(args, { signer });

      const submissionId = uuid();

      const updateCache = async (
        next: SubmittableResultInProcess<R> | Error,
      ): Promise<void> => {
        if (next instanceof Error) {
          await this.cache.set<ResultOrError<R>>(submissionId, {
            status: Status.error,
            error: next,
          });

          return;
        }

        if (next.submittableResult.isCompleted) {
          await this.cache.set<ResultOrError<R>>(submissionId, {
            status: Status.success,
            result: next.parsed,
          });
        }
      };

      result$.subscribe({
        next: updateCache,
        error: updateCache,
      });

      return { submissionId };
    }

    @Result
    async getResult(
      @Query() { submissionId }: GetResultQuery,
    ): Promise<ResultOrError<R>> {
      const result = await this.cache.get<ResultOrError<R>>(submissionId);

      if (result) return result;

      throw new NotFoundException(
        `No submission with id ${submissionId} found in cache`,
      );
    }
  }

  Object.defineProperty(MutationController, 'name', {
    value: `${MutationController.name}_${sectionPath}_${methodPath}`,
  });

  return MutationController;
}
