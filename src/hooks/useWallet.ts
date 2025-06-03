import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatEther } from 'ethers';
import { 
  connectWallet, 
  getProvider, 
  getWalletStatus, 
  onAccountChange,
  onChainChange,
  removeWalletListeners
} from '../services/wallet.provider';
import { 
  setWalletAddress, 
  setBalance, 
  setChainId, 
  disconnectWallet, 
  setNetworkError 
} from '../services/wallet.services';
import type { RootState } from '../store/store';

export function useWallet() {
  const dispatch = useDispatch();
  const walletState = useSelector((state: RootState) => state.wallet);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check initial wallet status
  useEffect(() => {
    const checkWalletStatus = async () => {
      try {
        const status = await getWalletStatus();
        if (status.isConnected) {
          await handleConnect();
        }
      } catch (err) {
        console.error("Error checking wallet status:", err);
      }
    };

    checkWalletStatus();
    
    // Set up account change listeners
    const unsubscribeAccount = onAccountChange((accounts) => {
      if (accounts.length === 0) {
        dispatch(disconnectWallet());
      } else {
        dispatch(setWalletAddress(accounts[0]));
        updateBalance(accounts[0]);
      }
    });
    
    // Set up chain change listeners
    onChainChange((chainIdHex) => {
      const chainId = parseInt(chainIdHex, 16);
      dispatch(setChainId(chainId));
      
      // Check if it's a supported chain
      if (chainId !== 1 && chainId !== 11155111 && chainId !== 80001) {
        dispatch(setNetworkError('Please connect to Ethereum, Sepolia testnet, or Polygon Mumbai'));
      } else {
        dispatch(setNetworkError(null));
      }
    });
    
    // Clean up
    return () => {
      unsubscribeAccount();
      removeWalletListeners();
    };
  }, [dispatch]);

  // Handle wallet connection
  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const accounts = await connectWallet();
      dispatch(setWalletAddress(accounts[0]));
      
      // Get the provider and chain ID
      const provider = getProvider();
      if (provider) {
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);
        dispatch(setChainId(chainId));
        
        // Check if it's a supported chain
        if (chainId !== 1 && chainId !== 11155111 && chainId !== 80001) {
          dispatch(setNetworkError('Please connect to Ethereum, Sepolia testnet, or Polygon Mumbai'));
        } else {
          dispatch(setNetworkError(null));
        }
        
        // Get and update the balance
        await updateBalance(accounts[0]);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update account balance
  const updateBalance = async (address: string) => {
    try {
      const provider = getProvider();
      if (provider) {
        const balance = await provider.getBalance(address);
        dispatch(setBalance(formatEther(balance)));
      }
    } catch (err) {
      console.error('Error getting balance:', err);
    }
  };
  
  // Handle wallet disconnection
  const handleDisconnect = () => {
    // Note: MetaMask does not support programmatic disconnection
    // So we just clear the app state
    dispatch(disconnectWallet());
  };
  
  return {
    ...walletState,
    isLoading,
    error,
    connect: handleConnect,
    disconnect: handleDisconnect
  };
}
