export type UserDatas = {
  walletAddr: string;
  claimedState: boolean;
  canClaimAmount: number;
};

export type GetTokenDataContextValue = {
  isBuyState: boolean;
  ethBalanceOfContract: number;
  currentTokenPerEth: number;
  isClaimableForuser: boolean;
  userData: number;
  getInfo: () => void;
};
