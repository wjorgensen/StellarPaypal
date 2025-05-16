"use client"

import { useState, useEffect } from "react"
import TransactionFeed from "@/components/transaction-feed"
import { TrendingUp, ArrowUpRight, Clock, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getWalletData, formatTimeRemaining, WalletData } from "@/lib/blockchain-data"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [walletData, setWalletData] = useState<WalletData | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Get stored wallet address if available
        let walletAddress = undefined
        if (typeof window !== 'undefined') {
          walletAddress = localStorage.getItem('stellarPaypal_walletAddress') || undefined
        }
        
        const data = await getWalletData(walletAddress)
        setWalletData(data)
      } catch (error) {
        console.error("Error fetching wallet data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to render change percentages
  const renderChangePercentage = (change: number) => {
    if (change === 0) return <p className="text-sm text-gray-500">0.0%</p>
    
    return (
      <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change > 0 ? '+' : ''}{change.toFixed(1)}%
      </p>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Home</h1>
          <p className="text-gray-600 mt-1">Welcome back, {walletData?.userName || 'User'}</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "all" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "friends" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Friends
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Portfolio Overview</h2>
            <Link
              href="/dashboard/wallet"
              className="text-blue-600 text-sm font-medium hover:underline flex items-center"
            >
              View Details
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-3xl font-bold">${walletData?.totalBalance.toFixed(2) || '0.00'}</p>
                  {walletData?.totalChange24h ? (
                    <div className="flex items-center mt-1 text-green-600">
                      <TrendingUp size={16} className="mr-1" />
                      <span className="text-sm font-medium">+{walletData.totalChange24h.toFixed(1)}% today</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">No change today</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link href="/dashboard/send-request">
                    <button className="p-2 rounded-lg bg-[#C7CEEA] bg-opacity-20 hover:bg-opacity-30 transition-colors">
                      <ArrowUpRight size={20} />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                {walletData?.tokens.map((token, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
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
                      {renderChangePercentage(token.change24h)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Rewards</h2>
            <Link
              href="/dashboard/interest"
              className="text-blue-600 text-sm font-medium hover:underline flex items-center"
            >
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Total earned</p>
                <p className="text-2xl font-bold mt-1">{walletData?.rewards.totalEarned.toFixed(2) || '0.00'} XLM</p>
                <p className="text-sm text-gray-500">≈ ${walletData?.rewards.totalEarnedUsd.toFixed(2) || '0.00'} USD</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                      <TrendingUp size={16} />
                    </div>
                    <p className="text-sm font-medium">XLM Staking</p>
                  </div>
                  <p className="text-sm font-medium">{walletData?.rewards.stakingApy.toFixed(1) || '0.0'}% APY</p>
                </div>

                {walletData?.rewards.nextReward ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
                        <Clock size={16} />
                      </div>
                      <p className="text-sm font-medium">Next reward</p>
                    </div>
                    <p className="text-sm font-medium">{formatTimeRemaining(walletData.rewards.nextReward)}</p>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
                        <Clock size={16} />
                      </div>
                      <p className="text-sm font-medium">Next reward</p>
                    </div>
                    <p className="text-sm font-medium">Deposit XLM to earn</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Recent Activity</h2>
          <div className="flex space-x-2">
            <button className="text-sm text-gray-500 hover:text-gray-900">Filter</button>
            <button className="text-sm text-gray-500 hover:text-gray-900">Sort</button>
          </div>
        </div>

        <TransactionFeed />
      </div>
    </div>
  )
} 