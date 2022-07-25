export interface ApproveArguments {
  spender: string,
  collectionId: number,
  tokenId: number,
  isApprove: boolean
}


export interface ApproveResult {
  collectionId: number,
  tokenId: number
}
