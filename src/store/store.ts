import { configureStore } from '@reduxjs/toolkit';
import walletReducer from '../services/wallet.services';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
