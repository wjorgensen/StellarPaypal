'use client';

import { useState, useEffect } from 'react';
import { account } from '@/lib/passkey';
import SubmitTx from './submit-tx';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [walletInfo, setWalletInfo] = useState<{
    keyId?: string;
    contractId?: string;
  } | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // Check environment variables when component mounts
  useEffect(() => {
    // Check if WASM hash is properly configured
    const wasmHash = process.env.NEXT_PUBLIC_WALLET_WASM_HASH;
    if (!wasmHash) {
      setConfigError("Missing NEXT_PUBLIC_WALLET_WASM_HASH in environment variables");
      console.error("Missing NEXT_PUBLIC_WALLET_WASM_HASH in environment variables");
    } else if (wasmHash.length !== 64) {  // Typical hash length for Soroban WASM
      setConfigError(`Invalid NEXT_PUBLIC_WALLET_WASM_HASH format: ${wasmHash}`);
      console.error(`Invalid NEXT_PUBLIC_WALLET_WASM_HASH format: ${wasmHash}`);
    }
  }, []);

  // Create a new wallet with passkey
  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Create a wallet using a random username
      const appName = 'StellarPaypal';
      const userName = `User-${Math.floor(Math.random() * 10000)}`;
      
      console.log(`Creating wallet for ${appName}/${userName}...`);
      const result = await account.createWallet(appName, userName);
      
      setWalletInfo({
        keyId: result.keyIdBase64,
        contractId: result.contractId
      });
      
      setSuccess(`Wallet created successfully! Contract ID: ${result.contractId.substring(0, 8)}...`);
      console.log('Created wallet:', result);
      
      // Note: In a real app, you'd want to submit the transaction to the network
      // using your API route
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  // Connect to an existing wallet with passkey
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('Connecting to wallet...');
      const result = await account.connectWallet();
      
      setWalletInfo({
        keyId: result.keyIdBase64,
        contractId: result.contractId
      });
      
      setSuccess(`Connected to wallet! Contract ID: ${result.contractId.substring(0, 8)}...`);
      console.log('Connected to wallet:', result);
    } catch (err) {
      console.error('Error connecting to wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Passkey Test</h1>
        
        {configError && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p className="font-bold">Configuration Error</p>
            <p>{configError}</p>
            <p className="mt-2 text-sm">
              Please set a valid NEXT_PUBLIC_WALLET_WASM_HASH in your .env.local file.
              You can obtain this hash by deploying the passkey contract to the Stellar network.
            </p>
          </div>
        )}
        
        <div className="flex flex-col gap-4 mb-6">
          <button
            onClick={handleSignup}
            disabled={loading || !!configError}
            className={`
              py-3 px-6 rounded transition-colors
              ${!configError 
                ? 'bg-blue-500 hover:bg-blue-700 text-white font-bold' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
          >
            {loading ? 'Processing...' : 'Sign Up with Passkey'}
          </button>
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition-colors"
          >
            {loading ? 'Processing...' : 'Login with Passkey'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p className="font-bold">Success</p>
            <p>{success}</p>
          </div>
        )}
        
        {walletInfo && (
          <div className="bg-gray-100 p-4 rounded overflow-hidden">
            <h2 className="text-lg font-bold mb-2">Wallet Info</h2>
            <div className="mb-2">
              <p className="font-semibold">Key ID:</p>
              <p className="overflow-x-auto text-sm break-all">{walletInfo.keyId}</p>
            </div>
            <div>
              <p className="font-semibold">Contract ID:</p>
              <p className="overflow-x-auto text-sm break-all">{walletInfo.contractId}</p>
            </div>
            
            {/* Add the transaction submission component if we have a contract */}
            {walletInfo.contractId && (
              <SubmitTx 
                contractId={walletInfo.contractId} 
                keyId={walletInfo.keyId}
              />
            )}
          </div>
        )}

        <div className="mt-6 border-t pt-4 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Required Environment Variables:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>NEXT_PUBLIC_RPC_URL: Soroban RPC endpoint</li>
            <li>NEXT_PUBLIC_NETWORK: Network passphrase</li>
            <li>NEXT_PUBLIC_WALLET_WASM_HASH: Deployed passkey contract hash</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 