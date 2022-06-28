// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;

export enum CollectionSchemaVersion {
  ImageURL = 'ImageURL',
  Unique = 'Unique',
}

export enum TokenPropertiesKeys {
  constData = '_old_constData',
}

export interface TokenPropertyPermissions {
  mutable?: boolean;
  collectionAdmin?: boolean;
  tokenOwner?: boolean;
}

export interface TokenProperties {
  constData?: AnyObject;
}

export interface TokenInfo {
  id: number;
  collectionId: number;
  url: string | null;
  owner: string | null;
  properties: TokenProperties;
}

export type TokenPayload =
  | {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      NFT: any;
    }
  | {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      Fungible: any;
    }
  | {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      ReFungible: any;
    };
