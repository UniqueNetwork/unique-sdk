import { AxiosInstance } from 'axios';
import {
  SignTxResultResponse,
  UnsignedTxPayloadBody,
  SubmitTxBody,
  SubmitResultResponse,
  ExtrinsicResultResponse,
  FeeResponse,
  TxBuildBody,
  UnsignedTxPayloadResponse,
  BalanceTransferBody,
  BalanceTransferParsed,
  AllBalancesResponse,
} from './api';

export interface IExtrinsics extends ISection {
  path: string;
  baseUrl: string;
  build(args: TxBuildBody): Promise<UnsignedTxPayloadBody>;
  getFee(
    args: TxBuildBody | UnsignedTxPayloadBody | SubmitTxBody,
  ): Promise<FeeResponse>;
  sign(args: UnsignedTxPayloadBody, signer: any): Promise<SignTxResultResponse>;
  submit(args: SubmitTxBody): Promise<SubmitResultResponse>;
  status(hash: string): Promise<ExtrinsicResultResponse>;
}

export interface ISection {
  path: string;
  baseUrl: string;
  client: IThinClient;
}

export interface MutationOptions {
  signer?: any;
}

export interface IMutation<A, R> {
  url: string;
  client: IThinClient;
  method: 'POST' | 'PUT' | 'PATCH';
  path: string;
  build(args: A): Promise<UnsignedTxPayloadResponse>;
  getFee(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<FeeResponse>;
  sign(
    args: A | UnsignedTxPayloadResponse,
    options?: MutationOptions,
  ): Promise<SubmitTxBody>;
  submit(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<SubmitResultResponse>;
  submitWatch(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<ExtrinsicResultResponse>;
  submitWaitResult(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<ExtrinsicResultResponse>;
}

export interface IBalance extends ISection {
  path: string;
  baseUrl: string;
  transfer: IMutation<BalanceTransferBody, BalanceTransferParsed>;
  get(args: { address: string }): Promise<AllBalancesResponse>;
}

export interface ClientParameters {
  maximumNumberOfStatusRequests: number;
  waitBetweenStatusRequestsInMs: number;
}

export interface Options {
  baseUrl: string;
  signer: any;
  maximumNumberOfStatusRequests?: number;
  waitBetweenStatusRequestsInMs?: number;
}

export interface IThinClient {
  instance: AxiosInstance;
  extrinsics: IExtrinsics;
  balance: IBalance;
  options: Options;
  params: ClientParameters;
}
