'use client';

export default function Transactions() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-black">Transactions</h2>
      
      <div className="bg-[#F8F9FA] p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-black">Transaction History</h3>
        <p className="text-gray-600">No transactions yet. Create or connect a wallet to start.</p>
      </div>
    </div>
  );
} 