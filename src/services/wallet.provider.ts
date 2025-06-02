import { BrowserProvider } from "ethers";
import type { WalletError } from "../types/ethereum";

export type WalletStatus = {
  isAvailable: boolean;
  isConnected: boolean;
  error?: string;
};

export async function getWalletStatus(): Promise<WalletStatus> {
  if (typeof window === "undefined" || !window.ethereum) {
    return {
      isAvailable: false,
      isConnected: false,
      error: "MetaMask is not installed",
    };
  }

  try {
    const response = await window.ethereum.request({ method: "eth_accounts" });
    const accounts = Array.isArray(response) ? response : [];
    return {
      isAvailable: true,
      isConnected: accounts.length > 0,
    };
  } catch (error) {
    const err = error as Error;
    return {
      isAvailable: true,
      isConnected: false,
      error: err.message || "Failed to check wallet connection",
    };
  }
}

export async function connectWallet(): Promise<string[]> {
  const status = await getWalletStatus();

  if (!status.isAvailable) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const response = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });

    if (!response || !Array.isArray(response)) {
      throw new Error("Invalid response from wallet");
    }

    const accounts = response as string[];
    if (accounts.length === 0) {
      throw new Error("No accounts found");
    }

    return accounts;
  } catch (error) {
    const err = error as WalletError;
    if (err.code === 4001) {
      throw new Error("User rejected connection");
    }
    throw new Error(err.message || "Failed to connect wallet");
  }
}

// No 'as any' needed after augmenting the Window interface
export function getProvider(): BrowserProvider | null {
  if (
    typeof window !== "undefined" &&
    typeof window.ethereum !== "undefined" &&
    window.ethereum !== null
  ) {
    console.log("window load");
    return new BrowserProvider(window.ethereum);
  }
  return null;
}

export function onAccountChange(callback: (accounts: string[]) => void) {
  if (
    typeof window !== "undefined" &&
    typeof window.ethereum !== "undefined" &&
    window.ethereum !== null
  ) {
    const handler = (accounts: unknown) => {
      if (
        Array.isArray(accounts) &&
        accounts.every((a) => typeof a === "string")
      ) {
        callback(accounts as string[]);
        // Force reload the page on account change
        window.location.reload();
      }
    };

    window.ethereum.on("accountsChanged", handler);

    return () => {
      if (window?.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handler);
      }
    };
  }
  return () => {};
}

export function onChainChange(callback: (chainId: string) => void) {
  if (typeof window !== "undefined" && window.ethereum) {
    window.ethereum.on("chainChanged", (chainId: unknown) => {
      if (typeof chainId === "string") {
        callback(chainId);
        // Force reload the page on chain change
        window.location.reload();
      }
    });
  }
}

export function removeWalletListeners() {
  if (typeof window !== "undefined" && window.ethereum) {
    window.ethereum.removeAllListeners("accountsChanged");
    window.ethereum.removeAllListeners("chainChanged");
  }
}
