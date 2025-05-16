"use client"

import { useState } from "react"
import { ArrowRight, TrendingUp, Clock, Award, ChevronRight } from "lucide-react"
import Image from "next/image"

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState("earn")

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Rewards & Earning</h1>
          <p className="text-gray-600 mt-1">Grow your crypto through staking and rewards</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("earn")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "earn" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Earn
          </button>
          <button
            onClick={() => setActiveTab("staking")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "staking" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Staking
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "history" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === "earn" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#C7CEEA] to-[#A7B4E0] rounded-xl p-6 text-black shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Total Rewards</h2>
                  <p className="text-sm opacity-80 mb-4">Lifetime earnings</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">12.45</span>
                    <span className="ml-2 font-medium">XLM</span>
                  </div>
                  <p className="text-sm mt-1 opacity-80">≈ $4.86 USD</p>
                </div>
                <div className="bg-white bg-opacity-30 p-3 rounded-full">
                  <Award size={24} />
                </div>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-1">
                  <div className="h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "35%" }}></div>
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium">Level 2</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-1">Current Earnings</h2>
              <p className="text-sm text-gray-500 mb-4">Updated daily</p>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <p className="font-medium">XLM Staking</p>
                      <p className="text-sm text-gray-500">4.5% APY</p>
                    </div>
                  </div>
                  <p className="font-semibold">+0.12 XLM</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <Award size={18} />
                    </div>
                    <div>
                      <p className="font-medium">Referral Bonus</p>
                      <p className="text-sm text-gray-500">2 referrals</p>
                    </div>
                  </div>
                  <p className="font-semibold">+5.00 XLM</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">Earning Opportunities</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-[#C7CEEA] bg-opacity-30 flex items-center justify-center mr-4">
                    <Image src="/xlm-abstract.png" alt="XLM" width={32} height={32} />
                  </div>
                  <div>
                    <h3 className="font-medium">Stellar (XLM) Staking</h3>
                    <p className="text-sm text-gray-500">Earn up to 4.5% APY on your XLM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 font-medium mr-2">4.5% APY</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-[#C7CEEA] bg-opacity-30 flex items-center justify-center mr-4">
                    <Image src="/usdc-coins.png" alt="USDC" width={32} height={32} />
                  </div>
                  <div>
                    <h3 className="font-medium">USDC Yield</h3>
                    <p className="text-sm text-gray-500">Earn interest on your stablecoin holdings</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 font-medium mr-2">3.2% APY</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-[#C7CEEA] bg-opacity-30 flex items-center justify-center mr-4">
                    <Award size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Referral Program</h3>
                    <p className="text-sm text-gray-500">Earn 5 XLM for each friend you refer</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 font-medium mr-2">Invite</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "staking" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Your Staked Assets</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#C7CEEA] flex items-center justify-center mr-3">
                    <Image src="/xlm-abstract.png" alt="XLM" width={24} height={24} />
                  </div>
                  <div>
                    <p className="font-medium">Stellar (XLM)</p>
                    <p className="text-sm text-gray-500">Staked: 120.5 XLM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">4.5% APY</p>
                  <p className="text-sm text-gray-500">≈ $47.12 USD</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#C7CEEA] flex items-center justify-center mr-3">
                    <Image src="/usdc-coins.png" alt="USDC" width={24} height={24} />
                  </div>
                  <div>
                    <p className="font-medium">USD Coin (USDC)</p>
                    <p className="text-sm text-gray-500">Staked: 25.0 USDC</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">3.2% APY</p>
                  <p className="text-sm text-gray-500">≈ $25.00 USD</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="bg-[#C7CEEA] text-black font-medium py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center">
                Stake More Assets
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Staking Rewards</h2>

            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-500">Total rewards earned</p>
                <p className="text-2xl font-bold mt-1">7.45 XLM</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next reward</p>
                <div className="flex items-center mt-1">
                  <Clock size={16} className="text-gray-500 mr-1" />
                  <p className="font-medium">In 12 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Reward Rate</p>
                <p className="font-medium">Estimated Annual Yield</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500">0.012 XLM per day</p>
                <p className="text-green-600 font-medium">≈ $17.15 USD</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Reward History</h2>

          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 border-b last:border-0">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full ${i % 2 === 0 ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"} flex items-center justify-center mr-3`}
                  >
                    {i % 2 === 0 ? <TrendingUp size={18} /> : <Award size={18} />}
                  </div>
                  <div>
                    <p className="font-medium">{i % 2 === 0 ? "Staking Reward" : "Referral Bonus"}</p>
                    <p className="text-sm text-gray-500">{`May ${15 - i}, 2025`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{`+${(0.12 * (5 - i)).toFixed(2)} XLM`}</p>
                  <p className="text-sm text-gray-500">{`≈ $${(0.047 * (5 - i)).toFixed(2)} USD`}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="text-blue-600 font-medium flex items-center mx-auto">
              View All History
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 