export interface WalletError extends Error {
  code: number;
}

type EthereumEventCallback<T = unknown> = (arg: T) => void;

declare interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (eventName: string, callback: EthereumEventCallback) => void;
    removeListener: (eventName: string, callback: EthereumEventCallback) => void;
    removeAllListeners: (eventName: string) => void;
    isConnected: () => boolean;
    enable: () => Promise<string[]>;
    selectedAddress: string | undefined;
  };
}
