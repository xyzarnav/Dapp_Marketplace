import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  address: string;
  isConnected: boolean;
  balance: string;
  chainId: number | null;
  networkError: string | null;
}

const initialState: WalletState = {
  address: "",
  isConnected: false,
  balance: "0",
  chainId: null,
  networkError: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
      state.isConnected = !!action.payload;
    },
    setBalance: (state, action: PayloadAction<string>) => {
      state.balance = action.payload;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
    disconnectWallet: (state) => {
      state.address = "";
      state.isConnected = false;
      state.balance = "0";
      state.chainId = null;
    },
    setNetworkError: (state, action: PayloadAction<string | null>) => {
      state.networkError = action.payload;
    },
  },
});

export const {
  setWalletAddress,
  setBalance,
  setChainId,
  disconnectWallet,
  setNetworkError,
} = walletSlice.actions;
export default walletSlice.reducer;
