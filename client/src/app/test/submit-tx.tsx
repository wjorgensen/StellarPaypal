'use client';

import { useState } from 'react';
import { account } from '@/lib/passkey';
import type { AssembledTransaction } from '@stellar/stellar-sdk/minimal/contract';

interface SubmitTxProps {
  contractId: string;
  keyId?: string;
}

export default function SubmitTx({ contractId, keyId }: SubmitTxProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSendTestTx = async () => {
    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      // For demo purposes, let's create a dummy/test transaction
      // In a real app, you'd create an actual transaction with Stellar SDK
      console.log(`Creating test transaction for contract ${contractId}...`);
      
      // This would be replaced with actual transaction creation
      // Using soroban-client or stellar-sdk to create a proper transaction
      const dummyTxXdr = "AAAAAgAAAABndftpk+LZLm/5Ko8cYS+PfOIpk+OWIoXY/Cu0PmRWNgAAAGQAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAGd1+2mT4tkub/kqjxxhL4984imT45Yihd..." // simplified example
      
      // Sign the transaction with the connected passkey
      const signedTx = await account.sign(dummyTxXdr, { keyId });
      console.log('Transaction signed:', signedTx);
      
      // Submit to your backend API
      const response = await fetch('/api/tx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tx: signedTx }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.statusText}`);
      }
      
      const { hash } = await response.json();
      setTxHash(hash);
      console.log('Transaction submitted:', hash);
    } catch (err) {
      console.error('Error sending transaction:', err);
      setError(err instanceof Error ? err.message : 'Failed to send transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h2 className="text-lg font-bold mb-4">Test Transaction</h2>
      
      <button
        onClick={handleSendTestTx}
        disabled={loading || !contractId}
        className={`
          py-2 px-4 rounded transition-colors
          ${contractId 
            ? 'bg-purple-500 hover:bg-purple-700 text-white font-bold' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
        `}
      >
        {loading ? 'Sending...' : 'Sign & Send Test Transaction'}
      </button>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4">
          <p className="font-bold">Transaction Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {txHash && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-4">
          <p className="font-bold">Transaction Submitted</p>
          <p className="break-all">{txHash}</p>
        </div>
      )}
      
      <p className="text-sm text-gray-500 mt-4">
        Note: This is a demonstration and uses a mock transaction. 
        In a real app, you would create a proper Stellar transaction.
      </p>
    </div>
  );
} 