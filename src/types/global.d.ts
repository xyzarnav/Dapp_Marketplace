// src/types/global.d.ts
// This file will be picked up by TypeScript automatically

import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider; // Mark as optional with '?'
  }
}

export {};
