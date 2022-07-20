export interface ApproveArguments {
  spender: string,
  collectionId: number,
  tokenId: number,
  amount: boolean
}


export interface ApproveResult {
  collectionId: number,
  tokenId: number
}
