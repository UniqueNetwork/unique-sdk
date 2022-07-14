/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface TokenInfoResponse {
  /** @example 1 */
  id: number;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  owner: string;

  /** @example 1 */
  collectionId: number;

  /**
   * URL of the token content on IPFS node (if available)
   * @example https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png
   */
  url: string;
}

export interface CreateTokenBody {
  address: string;

  /** @example 1 */
  collectionId: number;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  owner: string;

  /** @example {"ipfsJson":"{\"ipfs\":\"QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb\",\"type\":\"image\"}","gender":"Male","traits":["TEETH_SMILE","UP_HAIR"]} */
  constData: object;
}

export interface SignerPayloadJSONDto {
  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;

  /** The checkpoint hash of the block, in hex */
  blockHash: string;

  /** The checkpoint block number, in hex */
  blockNumber: string;

  /** The era for this transaction, in hex */
  era: string;

  /** The genesis hash of the chain, in hex */
  genesisHash: string;

  /** The encoded method (with arguments) in hex */
  method: string;

  /** The nonce for this transaction, in hex */
  nonce: string;

  /** The current spec version for the runtime */
  specVersion: string;

  /** The tip for this transaction, in hex */
  tip: string;

  /** The current transaction version for the runtime */
  transactionVersion: string;

  /** The applicable signed extensions for this runtime */
  signedExtensions: string[];

  /** The version of the extrinsic we are dealing with */
  version: number;
}

export interface SignerPayloadRawDto {
  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;

  /** The hex-encoded data for this request */
  data: string;

  /** The type of the contained data */
  type: 'bytes' | 'payload';
}

export interface FeeResponse {
  /** @example 92485000000000000 */
  raw: string;

  /** @example 0.092485000000000000 */
  amount: string;

  /** @example 92.4850 m */
  formatted: string;

  /** @example UNQ */
  unit: string;

  /** @example 18 */
  decimals: number;
}

export interface UnsignedTxPayloadResponse {
  signerPayloadJSON: SignerPayloadJSONDto;
  signerPayloadRaw: SignerPayloadRawDto;
  signerPayloadHex: string;
  fee?: FeeResponse;
}

export interface BurnTokenBody {
  /** @example 1 */
  collectionId: number;

  /** @example 1 */
  tokenId: number;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;
}

export interface TransferTokenBody {
  /** @example 1 */
  collectionId: number;

  /** @example 1 */
  tokenId: number;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  from: string;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  to: string;
}

export interface TokenId {
  /** @example 1 */
  collectionId: number;

  /** @example 1 */
  tokenId: number;
}

export interface NestTokenBody {
  /** @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm */
  address: string;

  /** Parent token object */
  parent: TokenId;

  /** Nested token object */
  nested: TokenId;
}

export interface UnnestTokenBody {
  /** @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm */
  address: string;

  /** Parent token object */
  parent: TokenId;

  /** Nested token object */
  nested: TokenId;
}

export interface TokenChildrenResponse {
  children: TokenId[];
}

export interface TokenParentResponse {
  /** @example 1 */
  collectionId: number;

  /** @example 1 */
  tokenId: number;

  /** @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm */
  address: string;
}

export interface TopmostTokenOwnerResponse {
  /** @example unjq56sK9skTMR1MyPLsDFXkQdRNNrD1gzE4wRJSYm2k6GjJn */
  topmostOwner: string;
}

export interface SignResponse {
  signerPayloadJSON: SignerPayloadJSONDto;

  /** Warning: Signature must be with SignatureType! */
  signature: string;
  fee?: FeeResponse;
}

export interface SubmitResponse {
  hash: string;
  fee?: FeeResponse;
}

export interface CollectionSponsorship {
  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;

  /** @example false */
  isConfirmed: boolean;
}

export interface CollectionLimitsDto {
  /**
   * Maximum number of tokens that one address can own
   * @example 1000
   */
  accountTokenOwnershipLimit?: number;

  /**
   * Maximum byte size of custom token data that can be sponsored when tokens are minted in sponsored mode
   * @example 1024
   */
  sponsoredDataSize?: number;

  /**
   * Defines how many blocks need to pass between setVariableMetadata transactions in order for them to be sponsored
   * @example 30
   */
  sponsoredDataRateLimit?: number;

  /**
   * Total amount of tokens that can be minted in this collection
   * @example 1000000
   */
  tokenLimit?: number;

  /**
   * Time interval in blocks that defines once per how long a non-privileged user transfer or mint transaction can be sponsored
   * @example 6
   */
  sponsorTransferTimeout?: number;

  /**
   * Time interval in blocks that defines once per how long a non-privileged user approve transaction can be sponsored
   * @example 6
   */
  sponsorApproveTimeout?: number;

  /**
   * Boolean value that tells if collection owner or admins can transfer or burn tokens owned by other non-privileged users
   * @example false
   */
  ownerCanTransfer?: boolean;

  /**
   * Boolean value that tells if collection owner can destroy it
   * @example false
   */
  ownerCanDestroy?: boolean;

  /**
   * Flag that defines whether token transfers between users are currently enabled
   * @example false
   */
  transfersEnabled?: boolean;
}

export interface CollectionNestingPermissionsDto {
  tokenOwner: boolean;
  collectionAdmin: boolean;
}

export interface CollectionPermissionsDto {
  access?: 'Normal' | 'AllowList';
  mintMode?: boolean;
  nesting?: CollectionNestingPermissionsDto;
}

export interface CollectionTextFieldDto {
  id: number;
  name: string;
  type: 'text';
  required?: boolean;
}

export interface CollectionSelectFieldDto {
  id: number;
  name: string;
  type: 'select';
  required?: boolean;
  items: string[];
  multi?: boolean;
}

export interface CollectionPropertiesDto {
  /** @example https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png */
  offchainSchema?: string;
  schemaVersion?: 'ImageURL' | 'Unique';

  /** @example {} */
  variableOnChainSchema?: string;

  /** @example {"nested":{"onChainMetaData":{"nested":{"NFTMeta":{"fields":{"ipfsJson":{"id":1,"rule":"required","type":"string"}}}}}}} */
  constOnChainSchema?: object;

  /** @example [{"id":1,"type":"text","name":"name","required":true},{"id":2,"type":"select","name":"mode","required":false,"items":["mode A","mode B"]}] */
  fields?: (CollectionTextFieldDto | CollectionSelectFieldDto)[];
}

export interface TokenPropertyPermissionsDto {
  mutable?: boolean;
  collectionAdmin?: boolean;
  tokenOwner?: boolean;
}

export interface TokenPropertiesPermissionsDto {
  constData?: TokenPropertyPermissionsDto;
}

export interface CreateCollectionBody {
  mode?: 'Nft' | 'Fungible' | 'ReFungible';

  /** @example Sample collection name */
  name: string;

  /** @example sample collection description */
  description: string;

  /** @example TEST */
  tokenPrefix: string;
  sponsorship?: CollectionSponsorship;
  limits?: CollectionLimitsDto;
  metaUpdatePermission?: 'ItemOwner' | 'Admin' | 'None';
  permissions?: CollectionPermissionsDto;
  properties: CollectionPropertiesDto;
  tokenPropertyPermissions?: TokenPropertiesPermissionsDto;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;
}

export interface CreateCollectionParsed {
  collectionId: number;
}

export interface CreateCollectionResponse {
  isError: boolean;
  fee?: FeeResponse;
  parsed: CreateCollectionParsed;
}

export interface SetCollectionLimitsBody {
  /** The collection limits */
  limits: CollectionLimitsDto;

  /**
   * The ss-58 encoded address
   * @example unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx
   */
  address: string;

  /** @example 1 */
  collectionId: number;
}

export interface BurnCollectionBody {
  /** @example 1 */
  collectionId: number;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;
}

export interface TransferCollectionBody {
  /** @example 1 */
  collectionId: number;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  from: string;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  to: string;
}

export interface ImageDto {
  /** @example https://ipfs.unique.network/ipfs/{infix}.ext */
  urlTemplate: string;
}

export interface ImagePreviewDto {
  /** @example https://ipfs.unique.network/ipfs/{infix}.ext */
  urlTemplate?: string;
}

export interface AudioDto {
  /** @example https://ipfs.unique.network/ipfs/{infix}.ext */
  urlTemplate?: string;
  format: string;
  isLossless: boolean;
}

export interface SpatialObjectDto {
  /** @example https://ipfs.unique.network/ipfs/{infix}.ext */
  urlTemplate?: string;
  format: string;
}

export interface VideoDto {
  /** @example https://ipfs.unique.network/ipfs/{infix}.ext */
  urlTemplate?: string;
}

export interface UniqueCollectionSchemaToCreateDto {
  /** @example {"0":{"name":{"en":"gender"},"type":1025,"kind":0,"enumValues":{"0":{"en":"Male"},"1":{"en":"Female"}}},"1":{"name":{"en":"traits"},"type":1025,"kind":1,"enumValues":{"0":{"en":"Black Lipstick"},"1":{"en":"Red Lipstick"}}}} */
  attributesSchema: Record<string, any>;

  /** @example 1.0.0 */
  attributesSchemaVersion: string;
  coverPicture:
    | { urlInfix?: string; hash?: string | null }
    | { url?: string; hash?: string | null }
    | { ipfsCid?: string; hash?: string | null };
  image: ImageDto;

  /** @example unique */
  schemaName: 'unique' | '_old_';

  /** @example 1.0.0 */
  schemaVersion: string;
  coverPicturePreview:
    | { urlInfix?: string; hash?: string | null }
    | { url?: string; hash?: string | null }
    | { ipfsCid?: string; hash?: string | null };
  imagePreview: ImagePreviewDto;
  audio: AudioDto;
  spatialObject: SpatialObjectDto;
  video: VideoDto;
}

export interface CreateCollectionNewRequest {
  mode?: 'Nft' | 'Fungible' | 'ReFungible';

  /** @example Sample collection name */
  name: string;

  /** @example sample collection description */
  description: string;

  /** @example TEST */
  tokenPrefix: string;
  sponsorship?: CollectionSponsorship;
  limits?: CollectionLimitsDto;
  metaUpdatePermission?: 'ItemOwner' | 'Admin' | 'None';
  permissions?: CollectionPermissionsDto;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;
  schema: UniqueCollectionSchemaToCreateDto;
}

type arrayNumberRecordStringAny = string;

export interface TxBuildBody {
  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;

  /** @example balances */
  section: string;

  /** @example transfer */
  method: string;

  /** @example ["yGEYS1E6fu9YtECXbMFRf1faXRakk3XDLuD1wPzYb4oRWwRJK",100000000] */
  args: arrayNumberRecordStringAny[];
}

export interface UnsignedTxPayloadBody {
  signerPayloadJSON: SignerPayloadJSONDto;
  signerPayloadRaw: SignerPayloadRawDto;
  signerPayloadHex: string;
  fee?: FeeResponse;
}

export interface SignTxResultResponse {
  signature: string;
  signatureType: 'sr25519' | 'ed25519' | 'ecdsa' | 'ethereum';
}

export interface SubmitTxBody {
  signerPayloadJSON: SignerPayloadJSONDto;

  /** Warning: Signature must be with SignatureType! */
  signature: string;
}

export interface VerificationResultResponse {
  isValid: boolean;
  errorMessage: string;
}

export interface SubmitResultResponse {
  hash: string;
}

export interface ExtrinsicResultEvent {
  section: string;
  method: string;
  data: object;
}

export interface ExtrinsicResultResponse {
  status: string;
  isCompleted: boolean;
  isError: boolean;
  blockHash: string;
  blockIndex: number;
  errorMessage: string;
  events: ExtrinsicResultEvent;
}

export interface BalanceResponse {
  /** @example 92485000000000000 */
  raw: string;

  /** @example 0.092485000000000000 */
  amount: string;

  /** @example 92.4850 m */
  formatted: string;

  /** @example UNQ */
  unit: string;

  /** @example 18 */
  decimals: number;
}

export interface AllBalancesResponse {
  availableBalance: BalanceResponse;
  lockedBalance: BalanceResponse;
  freeBalance: BalanceResponse;
}

export interface BalanceTransferBody {
  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;

  /**
   * The ss-58 encoded address
   * @example unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx
   */
  destination: string;

  /** @example 0.01 */
  amount: number;
}

export interface BalanceTransferParsed {
  success: boolean;
}

export interface BalanceTransferResponse {
  isError: boolean;
  fee?: FeeResponse;
  parsed: BalanceTransferParsed;
}

export interface ChainPropertiesResponse {
  /** @example 255 */
  SS58Prefix: number;

  /** @example QTZ */
  token: string;

  /** @example 18 */
  decimals: number;

  /** @example wss://ws-quartz.unique.network */
  wsUrl: string;

  /** @example 0xe9fa5b65a927e85627d87572161f0d86ef65d1432152d59b7a679fb6c7fd3b39 */
  genesisHash: string;
}

export interface ApiRequestBody {
  /** @example [] */
  args: string[];
}

export interface KeyringPairJsonDto {
  /** @example MFMCAQEwBQYDK2VwBCIEILbppIGq00fUiwaILydGVc6iwMRuhf4ChC/nr7j4dzl5Kg31MzrinKtrkxSLXWvax73fnO9pWCuWC8R5Hsg/0xahIwMhACoN9TM64pyra5MUi11r2se935zvaVgrlgvEeR7IP9MW */
  encoded: string;

  /** @example {"content":["pkcs8","ed25519"],"type":["none"],"version":"3"} */
  encoding: object;

  /** @example 5D1r1oYvhenhKT46RhizM6ExizbdvLvcF2ZFo1Swt6Lezhhq */
  address: string;

  /** @example {} */
  meta: object;
}

export interface AccountResponse {
  /**
   * The mnemonic seed gives full access to your account
   * @example little crouch armed put judge bamboo avoid fine actor soccer rebuild cluster
   */
  mnemonic: string;

  /**
   * The private key generated from the mnemonic
   * @example 0xb6e9a481aad347d48b06882f274655cea2c0c46e85fe02842fe7afb8f8773979
   */
  seed: string;

  /**
   * The public key generated from the mnemonic. The SS58 address is based on the public key (aka "Account ID")
   * @example 0x653bc0139ae6a8fd15db2f176fb3cc002b1ea53841379593c7a6ebb7b80ee751
   */
  publicKey: string;

  /** A JSON object containing the metadata associated with an account */
  keyfile: KeyringPairJsonDto;
}

export interface GenerateAccountBody {
  /** The password will be used to encrypt the account's information. But if someone knows your seed phrase they still have control over your account */
  password?: string;

  /** Signature: ed25519, sr25519 implementation using Schnorr signatures. ECDSA signatures on the secp256k1 curve */
  pairType?: 'sr25519' | 'ed25519' | 'ecdsa' | 'ethereum';

  /**
   * A metadata argument that contains account information (that may be obtained from the json file of an account backup)
   * @example {}
   */
  meta?: object;
}

export interface IpfsUploadResponse {
  /** File address */
  cid: string;

  /** IPFS gateway file URL */
  fileUrl?: string;
}
