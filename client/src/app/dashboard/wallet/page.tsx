"use client"

import { useState } from "react"
import { ChevronRight, ArrowRight, Plus, Clock, Copy } from "lucide-react"
import Link from "next/link"
import { WalletClient } from '@/lib/client'

export default function WalletPage() {
  const [walletInfo, setWalletInfo] = useState<{
    keyId?: string;
    contractId?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("assets");

  // Create a new wallet
  const createWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await WalletClient.createWallet(
        'Mosaic', 
        'User-' + Math.floor(Math.random() * 1000)
      );
      setWalletInfo(result);
      
      // Store wallet info in localStorage for persistence
      localStorage.setItem('walletInfo', JSON.stringify(result));

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
      
      // Store wallet info in localStorage for persistence
      localStorage.setItem('walletInfo', JSON.stringify(result));

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Check localStorage for wallet on component mount
  useState(() => {
    const storedWallet = localStorage.getItem('walletInfo');
    if (storedWallet) {
      try {
        setWalletInfo(JSON.parse(storedWallet));
      } catch (e) {
        console.error('Failed to parse stored wallet info');
      }
    }
  });
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Wallet</h1>
          <p className="text-gray-600 mt-1">Manage your digital assets</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("assets")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "assets" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Assets
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "activity" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {!walletInfo ? (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <h2 className="text-xl font-medium mb-4">Connect or Create a Wallet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by connecting an existing Stellar wallet or creating a new one.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <button
              onClick={createWallet}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Create New Wallet
            </button>
            
            <button
              onClick={connectWallet}
              disabled={loading}
              className="w-full py-3 bg-white text-blue-600 border border-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
            >
              Connect Existing Wallet
            </button>
          </div>
          
          {loading && <p className="mt-4 text-gray-600">Loading...</p>}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              <p>Error: {error}</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">My Wallet</h2>
              <div className="flex items-center">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(walletInfo.contractId || '');
                  }}
                  className="text-blue-600 text-sm font-medium hover:underline flex items-center"
                >
                  Copy Address
                  <Copy size={14} className="ml-1" />
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm text-gray-500 mb-1">Contract ID</p>
              <p className="font-mono text-sm break-all">{walletInfo.contractId}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Key ID</p>
              <p className="font-mono text-sm break-all">{walletInfo.keyId}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Assets</h2>
                <button className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                  Add Asset
                  <Plus size={16} className="ml-1" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#C7CEEA] flex items-center justify-center mr-3">
                      <span>XLM</span>
                    </div>
                    <div>
                      <p className="font-medium">Stellar (XLM)</p>
                      <p className="text-sm text-gray-500">120.5 XLM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$47.12</p>
                    <p className="text-sm text-green-600">+1.2%</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#C7CEEA] flex items-center justify-center mr-3">
                      <span>USDC</span>
                    </div>
                    <div>
                      <p className="font-medium">USD Coin (USDC)</p>
                      <p className="text-sm text-gray-500">25.0 USDC</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$25.00</p>
                    <p className="text-sm text-gray-500">0.0%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link href="/dashboard/send-request">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <p className="font-medium">Send Assets</p>
                    <ArrowRight size={18} className="text-gray-500" />
                  </div>
                </Link>
                
                <Link href="/dashboard/send-request?tab=request">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <p className="font-medium">Request Payment</p>
                    <ArrowRight size={18} className="text-gray-500" />
                  </div>
                </Link>
                
                <Link href="/dashboard/interest">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <p className="font-medium">Earn Rewards</p>
                    <ArrowRight size={18} className="text-gray-500" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 