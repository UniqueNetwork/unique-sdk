export type NestTokenParentArguments = {
  collectionId: number;
  tokenId: number;
};

export type NestTokenNestedArguments = {
  collectionId: number;
  tokenId: number;
};

export type NestTokenArguments = {
  parent: NestTokenParentArguments;
  nested: NestTokenNestedArguments;
  address: string;
};

export type NestTokenResult = {
  collectionId: number;
  tokenId: number;
};
