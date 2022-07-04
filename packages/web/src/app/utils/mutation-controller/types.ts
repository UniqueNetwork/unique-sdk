import { Type } from '@nestjs/common';
import { MutationMethodWrap } from '@unique-nft/sdk/extrinsics';

export type DtoFor<T> = { new (...args: any[]): T };

export type ControllerOptions<A, R> = {
  sectionPath: string;
  tag?: string;
  methodPath?: string;
  MutationConstructor: Type<MutationMethodWrap<A, R>>;
  inputDto: DtoFor<A>;
  outputDto: DtoFor<R>;
};

export enum Status {
  pending = 'pending',
  success = 'success',
  error = 'error',
}

export type ResultOrError<T> = {
  status: Status;
  result?: T;
  error?: Error;
};

export interface GetResult {
  submissionId: string;
}

export enum Action {
  build = 'build',
  sign = 'sign',
  submit = 'submit',
}

export interface ActionResult {
  action: Action;
}
