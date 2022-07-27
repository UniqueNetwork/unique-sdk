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
  sign(
    args: UnsignedTxPayloadBody,
    signer: Signer,
  ): Promise<SignTxResultResponse>;
  submit(args: SubmitTxBody): Promise<SubmitResultResponse>;
  status(hash: string): Promise<ExtrinsicResultResponse<any>>;
}

export interface ISection {
  path: string;
  baseUrl: string;
  client: IClient;
}

export interface MutationOptions {
  signer?: Signer;
}

export interface IMutation<A, R> {
  url: string;
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
  // submitWatch(
  //   args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  // ): Promise<ExtrinsicResultResponse>;
  submitWaitResult(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<R>;
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
  signer: Signer | null;
  maximumNumberOfStatusRequests?: number;
  waitBetweenStatusRequestsInMs?: number;
}

export interface IClient {
  instance: AxiosInstance;
  extrinsics: IExtrinsics;
  balance: IBalance;
  options: Options;
  params: ClientParameters;
}

export interface Signer {
  sign(unsignedTxPayload: UnsignedTxPayloadBody): Promise<SignTxResultResponse>;
}
