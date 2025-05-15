'use client';

import { useState } from 'react';
import { WalletClient } from '@/lib/client';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletInfo, setWalletInfo] = useState<{
    keyId?: string;
    contractId?: string;
  } | null>(null);
  const [signers, setSigners] = useState<any[]>([]);

  // Create a new wallet
  const createWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await WalletClient.createWallet(
        'StellarPaypal', 
        'User-' + Math.floor(Math.random() * 1000)
      );
      setWalletInfo(result);
      
      // Get signers for the new wallet
      const walletSigners = await WalletClient.getSigners(result.contractId);
      setSigners(walletSigners);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Connect to an existing wallet
  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await WalletClient.connectWallet();
      setWalletInfo(result);
      
      // Get signers for the connected wallet
      const walletSigners = await WalletClient.getSigners(result.contractId);
      setSigners(walletSigners);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Stellar Passkey Wallet</h1>
        
        <div className="flex flex-col gap-4 mb-8">
          <button 
            onClick={createWallet}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Wallet
          </button>
          
          <button 
            onClick={connectWallet}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect Existing Wallet
          </button>
        </div>
        
        {loading && <p className="text-center">Loading...</p>}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {walletInfo && (
          <div className="bg-gray-100 p-4 rounded mb-4">
            <h2 className="text-xl font-bold mb-2">Wallet Info</h2>
            <p><strong>Key ID:</strong> {walletInfo.keyId}</p>
            <p><strong>Contract ID:</strong> {walletInfo.contractId}</p>
          </div>
        )}
        
        {signers.length > 0 && (
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Signers</h2>
            <ul className="list-disc pl-5">
              {signers.map((signer, index) => (
                <li key={index}>
                  <strong>{signer.kind}:</strong> {signer.key.substring(0, 10)}...
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
} 