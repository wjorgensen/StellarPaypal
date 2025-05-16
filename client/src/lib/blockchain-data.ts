import { NETWORK, getRpcClient } from './soroban';

// Mock blockchain data with realistic values
// In a production app, these would be actual API calls to the Stellar network

export interface TokenBalance {
  symbol: string;
  name: string;
  amount: number;
  usdValue: number;
  change24h: number;
}

export interface WalletData {
  address: string;
  userName: string;
  totalBalance: number;
  totalChange24h: number;
  tokens: TokenBalance[];
  rewards: {
    totalEarned: number;
    totalEarnedUsd: number;
    stakingApy: number;
    nextReward: number; // in minutes
  };
}

// Function to get wallet data from blockchain
export async function getWalletData(walletAddress?: string): Promise<WalletData> {
  try {
    console.log('Getting wallet data for address:', walletAddress);
    
    // Check if this is a new user from localStorage
    let isNewUser = false;
    let userName = 'Wes';
    let address = walletAddress || 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';
    
    // If running in browser context, check localStorage
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem('stellarPaypal_username');
      const storedWalletAddress = localStorage.getItem('stellarPaypal_walletAddress');
      
      if (storedUserName) {
        userName = storedUserName;
        isNewUser = true;
      }
      
      if (storedWalletAddress) {
        address = storedWalletAddress;
      }
    }
    
    // In a real app, we would make RPC calls to get this data
    // For now, we'll simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // If new user, return zero balances
    if (isNewUser) {
      return {
        address,
        userName,
        totalBalance: 0,
        totalChange24h: 0,
        tokens: [
          {
            symbol: 'XLM',
            name: 'Stellar',
            amount: 0,
            usdValue: 0,
            change24h: 0
          },
          {
            symbol: 'USDC',
            name: 'USD Coin',
            amount: 0,
            usdValue: 0,
            change24h: 0
          }
        ],
        rewards: {
          totalEarned: 0,
          totalEarnedUsd: 0,
          stakingApy: 4.5, // Show the potential APY
          nextReward: 0
        }
      };
    }
    
    // Otherwise return mock data for existing users
    return {
      address,
      userName,
      totalBalance: 72.12,
      totalChange24h: 2.4,
      tokens: [
        {
          symbol: 'XLM',
          name: 'Stellar',
          amount: 120.5,
          usdValue: 47.12,
          change24h: 1.2
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          amount: 25.0,
          usdValue: 25.00,
          change24h: 0.0
        }
      ],
      rewards: {
        totalEarned: 12.45,
        totalEarnedUsd: 4.86,
        stakingApy: 4.5,
        nextReward: 750 // 12 hours and 30 minutes in minutes
      }
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    // Return minimal data structure in case of error
    return {
      address: walletAddress || 'unknown',
      userName: 'User',
      totalBalance: 0,
      totalChange24h: 0,
      tokens: [],
      rewards: {
        totalEarned: 0,
        totalEarnedUsd: 0,
        stakingApy: 0,
        nextReward: 0
      }
    };
  }
}

// Format time remaining in a human-readable format
export function formatTimeRemaining(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  
  return `${mins}m`;
}

// Get a specific token balance
export async function getTokenBalance(symbol: string, walletAddress?: string): Promise<TokenBalance | null> {
  const walletData = await getWalletData(walletAddress);
  return walletData.tokens.find(token => token.symbol === symbol) || null;
} 