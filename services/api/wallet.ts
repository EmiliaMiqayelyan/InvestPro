import apiClient from "./client";
import type { ApiResponse, CryptoWalletAddress, Wallet } from "@/types";

export const walletApi = {
  getWallet: () => apiClient.get<ApiResponse<Wallet>>("/wallet"),

  getCryptoAddresses: () =>
    apiClient.get<ApiResponse<CryptoWalletAddress[]>>("/wallet/crypto-addresses"),

  generateCryptoAddress: (currency: string) =>
    apiClient.post<ApiResponse<CryptoWalletAddress>>("/wallet/crypto-addresses", {
      currency,
    }),
};
