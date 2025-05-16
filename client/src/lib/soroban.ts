import { Networks } from '@stellar/stellar-sdk';
import { Buffer } from 'buffer';

// Network configuration
export const NETWORK = Networks.TESTNET;
export const RPC_URL = 'https://soroban-testnet.stellar.org';

// Use a fallback value for testing if env var is not set
export const FACTORY_CONTRACT_ID = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ID || 'CCQR52RRFVSNLKBKM4DPBDXVJWWQ454Q5JTMGJ5LMNQQ2WWVF7WR2TKP';

// For debugging
console.log('Factory Contract ID:', FACTORY_CONTRACT_ID);

// Simplified mock RPC client for demo purposes
const mockRpcClient = {
  getAccount: async (publicKey: string) => {
    console.log('Mock getAccount for', publicKey);
    // Return a simple account structure for demo
    return {
      accountId: publicKey,
      sequenceNumber: '1000',
      sequenceLedger: 100,
      sequenceTime: 0
    };
  },
  prepareTransaction: async (tx: any) => {
    console.log('Mock prepareTransaction');
    return tx;
  },
  sendTransaction: async (tx: any) => {
    console.log('Mock sendTransaction');
    // Add errorResult property to match expected type
    return { 
      status: 'PENDING', 
      hash: 'mock-transaction-hash',
      errorResult: { toString: () => 'No error' } 
    };
  },
  getTransaction: async (hash: string) => {
    console.log('Mock getTransaction', hash);
    // Add errorResult property to match expected type
    return { 
      status: 'SUCCESS', 
      results: [], 
      returnValue: null,
      errorResult: { toString: () => 'No error' }
    };
  },
  simulateTransaction: async (tx: any) => {
    console.log('Mock simulateTransaction');
    return { results: [] };
  }
};

// Get the Soroban RPC client (using mock for demo)
export async function getRpcClient() {
  // In a real app, we would try to use the actual SDK
  // But for this demo, we'll use the mock client to avoid errors
  console.log('Using mock RPC client for demo');
  return mockRpcClient;
}

// Get account details
export async function getAccount(publicKey: string) {
  try {
    const client = await getRpcClient();
    return await client.getAccount(publicKey);
  } catch (error) {
    console.error('Error getting account:', error);
    throw error;
  }
}

// Build and submit a transaction
export async function submitTransaction(tx: any) {
  try {
    const client = await getRpcClient();
    const sendResponse = await client.sendTransaction(tx);
    
    if (sendResponse.status === 'ERROR') {
      throw new Error(`Transaction failed: ${sendResponse.errorResult?.toString() || 'Unknown error'}`);
    }
    
    let getResponse = await client.getTransaction(sendResponse.hash);
    
    // Poll for transaction status
    while (getResponse.status === 'NOT_FOUND' || getResponse.status === 'PENDING') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      getResponse = await client.getTransaction(sendResponse.hash);
    }
    
    if (getResponse.status === 'SUCCESS') {
      return getResponse;
    } else {
      throw new Error(`Transaction failed: ${getResponse.errorResult?.toString() || getResponse.status}`);
    }
  } catch (error) {
    console.error('Error submitting transaction:', error);
    throw error;
  }
} 