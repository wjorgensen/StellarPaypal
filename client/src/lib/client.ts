import { account } from '@/lib/passkey';
import type { Tx } from '@stellar/stellar-sdk/minimal/contract';
import base64url from 'base64url';

/**
 * Client-side helper for interacting with the Passkey wallet
 * and the server-side API routes.
 */
export class WalletClient {
  /**
   * Send a transaction to the server for processing
   */
  static async sendTransaction(tx: Tx): Promise<string> {
    const response = await fetch('/api/tx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tx }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send transaction: ${errorText}`);
    }
    
    const { hash } = await response.json();
    return hash;
  }
  
  /**
   * Get contract ID from passkey ID
   */
  static async getContractId(passkeyId: string): Promise<string> {
    const response = await fetch(`/api/wallet?passkeyId=${encodeURIComponent(passkeyId)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get contract ID: ${errorText}`);
    }
    
    const { contractId } = await response.json();
    return contractId;
  }
  
  /**
   * Get signers for a contract
   */
  static async getSigners(contractId: string): Promise<any[]> {
    const response = await fetch('/api/wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contractId }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get signers: ${errorText}`);
    }
    
    const { signers } = await response.json();
    return signers;
  }

  /**
   * Get balance for a contract
   * This is a mock implementation for demo purposes
   */
  static async getBalance(contractId: string): Promise<{XLM: string, USDC: string}> {
    // In a real implementation, this would fetch balance from Stellar network
    // For now, we'll return mock data
    return {
      XLM: "120.5",
      USDC: "25.0"
    };
  }
  
  /**
   * Create a new wallet
   */
  static async createWallet(appName: string, userName: string): Promise<{
    keyId: string;
    contractId: string;
  }> {
    const result = await account.createWallet(appName, userName);
    
    // Send the transaction to be processed
    await this.sendTransaction(result.signedTx);
    
    return {
      keyId: result.keyIdBase64,
      contractId: result.contractId,
    };
  }
  
  /**
   * Connect to an existing wallet
   */
  static async connectWallet(keyId?: string): Promise<{
    keyId: string;
    contractId: string;
  }> {
    const result = await account.connectWallet({
      keyId,
      getContractId: keyId ? 
        async (id) => this.getContractId(id) : 
        undefined,
    });
    
    return {
      keyId: result.keyIdBase64,
      contractId: result.contractId,
    };
  }
  
  /**
   * Sign a transaction with connected wallet
   */
  static async signTransaction<T>(tx: any, keyId?: string): Promise<any> {
    return account.sign(tx, {
      keyId: keyId || undefined,
    });
  }
} 