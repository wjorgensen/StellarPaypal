"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ArrowRight, Plus, Clock, Copy } from "lucide-react"
import Link from "next/link"
import { WalletClient } from '@/lib/client'
import { getWalletData } from "@/lib/blockchain-data"

export default function WalletPage() {
  const [walletInfo, setWalletInfo] = useState<{
    keyId?: string;
    contractId?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("assets");
  const [walletData, setWalletData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(false);
  
  // Check localStorage for user and wallet data on component mount
  useEffect(() => {
    async function loadData() {
      // Check for wallet info
      const storedWallet = localStorage.getItem('walletInfo');
      if (storedWallet) {
        try {
          const walletInfoData = JSON.parse(storedWallet);
          setWalletInfo(walletInfoData);
          
          // Fetch wallet data
          setDataLoading(true);
          try {
            const data = await getWalletData(walletInfoData.contractId);
            setWalletData(data);
          } catch (dataError) {
            console.error('Failed to fetch wallet data:', dataError);
          } finally {
            setDataLoading(false);
          }
        } catch (e) {
          console.error('Failed to parse stored wallet info', e);
        }
      } else {
        // Check if we have a wallet address from signup/login
        const storedWalletAddress = localStorage.getItem('stellarPaypal_walletAddress');
        if (storedWalletAddress) {
          setWalletInfo({
            contractId: storedWalletAddress,
            keyId: 'Passkey-Authentication'
          });
          
          // Fetch wallet data
          setDataLoading(true);
          try {
            const data = await getWalletData(storedWalletAddress);
            setWalletData(data);
          } catch (dataError) {
            console.error('Failed to fetch wallet data:', dataError);
          } finally {
            setDataLoading(false);
          }
        }
      }
    }
    
    loadData();
  }, []);

  // Create a new wallet
  const createWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get username from localStorage if available
      let username = "User";
      if (typeof window !== "undefined") {
        const storedUsername = localStorage.getItem("stellarPaypal_username");
        if (storedUsername) {
          username = storedUsername;
        }
      }
      
      const result = await WalletClient.createWallet(
        'Mosaic', 
        username + '-' + Math.floor(Math.random() * 1000)
      );
      setWalletInfo(result);
      
      // Store wallet info in localStorage for persistence
      localStorage.setItem('walletInfo', JSON.stringify(result));
      
      // Also store in the stellarPaypal_walletAddress for consistency
      if (result.contractId) {
        localStorage.setItem('stellarPaypal_walletAddress', result.contractId);
      }
      
      // Fetch wallet data (will be zero balances for a new wallet)
      setDataLoading(true);
      try {
        const data = await getWalletData(result.contractId);
        setWalletData(data);
      } catch (dataError) {
        console.error('Failed to fetch wallet data:', dataError);
      } finally {
        setDataLoading(false);
      }

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
      
      // Also store in the stellarPaypal_walletAddress for consistency
      if (result.contractId) {
        localStorage.setItem('stellarPaypal_walletAddress', result.contractId);
      }
      
      // Fetch wallet data
      setDataLoading(true);
      try {
        const data = await getWalletData(result.contractId);
        setWalletData(data);
      } catch (dataError) {
        console.error('Failed to fetch wallet data:', dataError);
      } finally {
        setDataLoading(false);
      }

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
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
              
              {dataLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {walletData && walletData.tokens && walletData.tokens.map((token: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#C7CEEA] flex items-center justify-center mr-3">
                          <span>{token.symbol}</span>
                        </div>
                        <div>
                          <p className="font-medium">{token.name} ({token.symbol})</p>
                          <p className="text-sm text-gray-500">{token.amount.toFixed(1)} {token.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${token.usdValue.toFixed(2)}</p>
                        <p className={`text-sm ${token.change24h > 0 ? 'text-green-600' : token.change24h < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {(!walletData || !walletData.tokens || walletData.tokens.length === 0) && (
                    <div className="text-center p-10 text-gray-500">
                      <p>No assets found in this wallet.</p>
                    </div>
                  )}
                </div>
              )}
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