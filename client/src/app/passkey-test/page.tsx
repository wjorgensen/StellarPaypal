'use client';

import { useState, useEffect } from 'react';
import { signupWithPasskey, loginWithPasskey } from '../../lib/wallet-auth';

// Saved admin public key
const SAVED_ADMIN_KEY = 'GBROWYGLWTPFFRCSQODWSO7PL3UXHJEC7XQTJBYYNAJKJOMKNHBUFSO3';

export default function PasskeyTest() {
  const [username, setUsername] = useState('');
  const [adminPublicKey, setAdminPublicKey] = useState(SAVED_ADMIN_KEY);
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('Starting signup process...');
    
    try {
      // Log attempts
      console.log('Attempting signup with:', { username, adminPublicKey });
      
      const result = await signupWithPasskey(username, adminPublicKey);
      
      if (result.success && result.walletAddress) {
        setWalletAddress(result.walletAddress);
        setStatus(`Signup successful! Wallet deployed at: ${result.walletAddress}`);
      } else {
        setStatus(`Signup failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('Starting login process...');
    
    try {
      console.log('Attempting login');
      const result = await loginWithPasskey();
      
      if (result.success && result.walletAddress) {
        setWalletAddress(result.walletAddress);
        setStatus(`Login successful! Wallet address: ${result.walletAddress}`);
      } else {
        setStatus(`Login failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Stellar Passkey Wallet Tester</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Signup with Passkey</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Admin Public Key (for deploying contract)</label>
              <input
                type="text"
                value={adminPublicKey}
                onChange={(e) => setAdminPublicKey(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="G..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>
        </div>
        
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Login with Passkey</h2>
          <form onSubmit={handleLogin}>
            <p className="mb-4">
              Click the button below to start the login process with your passkey.
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      
      {status && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold">Status:</h2>
          <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-60">{status}</pre>
        </div>
      )}
      
      {walletAddress && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h2 className="text-lg font-semibold">Wallet Address:</h2>
          <pre className="mt-2 font-mono break-all">{walletAddress}</pre>
        </div>
      )}
      
      <div className="mt-10 border-t pt-4">
        <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>This is a test implementation for demonstration purposes.</li>
          <li>In a production environment, you should handle the passkey attestation verification server-side.</li>
          <li>The factory contract should be deployed via CLI using the provided script.</li>
          <li>Set the NEXT_PUBLIC_FACTORY_CONTRACT_ID environment variable after deployment.</li>
          <li className="text-red-600">Important: Make sure the NEXT_PUBLIC_FACTORY_CONTRACT_ID environment variable is set in .env.local</li>
        </ul>
      </div>
    </div>
  );
} 