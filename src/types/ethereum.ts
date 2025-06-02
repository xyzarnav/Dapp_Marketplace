import type { MetaMaskInpageProvider } from "@metamask/providers";

export type EthereumProvider = MetaMaskInpageProvider;

export interface WalletError extends Error {
  code?: number;
}
