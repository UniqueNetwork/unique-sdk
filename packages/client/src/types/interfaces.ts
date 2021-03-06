import { AxiosInstance } from 'axios';
import {
  TokenParentResponse,
  CollectionProperty,
  TokenPropertyDeletedEvent,
  SetTokenPropertiesBody,
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
  TokenProperty,
  TokenId,
  TokenPropertySetEvent,
  DeleteTokenPropertiesBody,
  SetCollectionPropertiesBody,
  CollectionPropertySetEvent,
  DeleteCollectionPropertiesBody,
  CollectionPropertyDeletedEvent,
  PropertyKeyPermission,
  SetPropertyPermissionsBody,
  PropertyPermissionSetEvent,
  CollectionInfoWithSchemaResponse,
  CreateCollectionNewRequest,
  CreateCollectionParsed,
  CreateTokenNewDto,
  UniqueTokenDecodedResponse,
  TopmostTokenOwnerResponse,
  NestTokenBody,
  UnnestTokenBody,
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
  submitWatch(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<SubmitResultResponse>;
  submitWaitResult(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<ExtrinsicResultResponse<R>>;
}

export interface IBalance extends ISection {
  path: string;
  baseUrl: string;
  transfer: IMutation<BalanceTransferBody, BalanceTransferParsed>;
  get(args: { address: string }): Promise<AllBalancesResponse>;
}

export interface ICollections extends ISection {
  path: string;
  baseUrl: string;
  creation: IMutation<CreateCollectionNewRequest, CreateCollectionParsed>;
  get(args: {
    collectionId: number;
  }): Promise<CollectionInfoWithSchemaResponse>;
  properties(args: { collectionId: number }): Promise<CollectionProperty[]>;
  setProperties: IMutation<
    SetCollectionPropertiesBody,
    CollectionPropertySetEvent[]
  >;
  deleteProperties: IMutation<
    DeleteCollectionPropertiesBody,
    CollectionPropertyDeletedEvent[]
  >;
  propertyPermissions(args: {
    collectionId: number;
  }): Promise<PropertyKeyPermission[]>;
  setPropertyPermissions: IMutation<
    SetPropertyPermissionsBody,
    PropertyPermissionSetEvent[]
  >;
}

export interface ITokens extends ISection {
  path: string;
  baseUrl: string;
  create: IMutation<CreateTokenNewDto, TokenId>;
  get(args: TokenId): Promise<UniqueTokenDecodedResponse>;
  properties(args: TokenId): Promise<TokenProperty[]>;
  setProperties: IMutation<SetTokenPropertiesBody, TokenPropertySetEvent[]>;
  deleteProperties: IMutation<
    DeleteTokenPropertiesBody,
    TokenPropertyDeletedEvent[]
  >;
  children(args: TokenId): Promise<TokenId[]>;
  parent(args: TokenId): Promise<TokenParentResponse>;
  topmostOwner(args: TokenId): Promise<TopmostTokenOwnerResponse>;
  nest: IMutation<NestTokenBody, TokenId>;
  unnest: IMutation<UnnestTokenBody, TokenId>;
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
