"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { walletApi } from "@/services/api";

export function useWallet() {
  return useQuery({
    queryKey: [QUERY_KEYS.WALLET],
    queryFn: async () => {
      const { data } = await walletApi.getWallet();
      return data.data;
    },
  });
}

export function useCryptoAddresses() {
  return useQuery({
    queryKey: [QUERY_KEYS.CRYPTO_ADDRESSES],
    queryFn: async () => {
      const { data } = await walletApi.getCryptoAddresses();
      return data.data;
    },
  });
}
