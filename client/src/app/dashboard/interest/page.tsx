"use client"

import { useState, useEffect } from "react"
import { ArrowRight, TrendingUp, Clock, Award, ChevronRight, Check, X, Info, Fingerprint } from "lucide-react"
import Image from "next/image"
import { startAuthentication } from '@simplewebauthn/browser'
import { createAuthenticationOptions } from '@/lib/passkey-wallet'

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState("earn")
  const [isNewUser, setIsNewUser] = useState(false)
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [autoManage, setAutoManage] = useState(true)
  const [savingsPercentage, setSavingsPercentage] = useState(50)
  const [savingsAccountCreated, setSavingsAccountCreated] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState("")

  // Check if user is new (has just signed up)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("stellarPaypal_username")
      const storedWalletAddress = localStorage.getItem("stellarPaypal_walletAddress")
      const existingSavingsAccount = localStorage.getItem("stellarPaypal_savingsAccount")
      
      // User is new if they have a username and wallet but no existing savings account
      if (storedUsername && storedWalletAddress && !existingSavingsAccount) {
        setIsNewUser(true)
      } else if (existingSavingsAccount) {
        setSavingsAccountCreated(true)
      }
    }
  }, [])

  const handleCreateSavingsAccount = () => {
    setShowSetupModal(true)
  }

  const handleConfirmSetup = async () => {
    try {
      setIsAuthenticating(true)
      setAuthError("")
      
      // Create WebAuthn authentication options
      const options = createAuthenticationOptions()
      
      // Trigger browser's WebAuthn flow (Touch ID, Face ID, etc.)
      await startAuthentication({
        optionsJSON: options
      })
      
      // If authentication is successful, create the savings account
      // In a real app, this would make API calls to create the savings account
      // For now, we'll just save to localStorage
      localStorage.setItem("stellarPaypal_savingsAccount", "true")
      localStorage.setItem("stellarPaypal_savingsAutoManage", autoManage.toString())
      localStorage.setItem("stellarPaypal_savingsPercentage", savingsPercentage.toString())
      
      setShowSetupModal(false)
      setSavingsAccountCreated(true)
      setIsNewUser(false)
    } catch (error) {
      console.error("Authentication error:", error)
      setAuthError("Authentication failed. Please try again.")
    } finally {
      setIsAuthenticating(false)
    }
  }

  // Content shown to new users who haven't set up a savings account yet
  const renderNewUserContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Welcome to Stellar Rewards</h2>
        <p className="text-gray-600 mb-6">
          Start earning passive income on your digital assets by creating a savings account powered by the Stellar blockchain.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#C7CEEA] bg-opacity-20 p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-[#C7CEEA] flex items-center justify-center mr-3">
                <TrendingUp size={18} />
              </div>
              <h3 className="font-medium">Competitive Yields</h3>
            </div>
            <p className="text-sm text-gray-600">Earn up to 4.5% APY on your XLM and 3.2% on USDC</p>
          </div>

          <div className="bg-[#C7CEEA] bg-opacity-20 p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-[#C7CEEA] flex items-center justify-center mr-3">
                <Clock size={18} />
              </div>
              <h3 className="font-medium">Daily Rewards</h3>
            </div>
            <p className="text-sm text-gray-600">Rewards are calculated daily and distributed automatically</p>
          </div>

          <div className="bg-[#C7CEEA] bg-opacity-20 p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-[#C7CEEA] flex items-center justify-center mr-3">
                <Award size={18} />
              </div>
              <h3 className="font-medium">Withdraw Anytime</h3>
            </div>
            <p className="text-sm text-gray-600">Access your funds within 1 hour of withdrawal request</p>
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={handleCreateSavingsAccount}
            className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            Create Savings Account
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
              <span>1</span>
            </div>
            <div>
              <h3 className="font-medium mb-1">Create a Savings Account</h3>
              <p className="text-sm text-gray-600">Set up your account with just a few clicks. No minimum deposit required.</p>
            </div>
          </div>

          <div className="flex">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
              <span>2</span>
            </div>
            <div>
              <h3 className="font-medium mb-1">Deposit Assets</h3>
              <p className="text-sm text-gray-600">Transfer XLM, USDC, or other supported assets to your savings account.</p>
            </div>
          </div>

          <div className="flex">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
              <span>3</span>
            </div>
            <div>
              <h3 className="font-medium mb-1">Earn Rewards</h3>
              <p className="text-sm text-gray-600">Your assets automatically start earning rewards, calculated daily.</p>
            </div>
          </div>

          <div className="flex">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
              <span>4</span>
            </div>
            <div>
              <h3 className="font-medium mb-1">Withdraw Anytime</h3>
              <p className="text-sm text-gray-600">Access your funds within 1 hour, with no penalties or fees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Setup modal for configuring savings account
  const renderSetupModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Set Up Your Savings Account</h2>
        <p className="text-gray-600 mb-6">Customize how you want to manage your savings</p>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Automatic Management</h3>
              <p className="text-sm text-gray-500">Let us optimize your savings for you</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={autoManage}
                onChange={() => setAutoManage(!autoManage)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className={autoManage ? "" : "opacity-50 pointer-events-none"}>
            <h3 className="font-medium mb-2">Savings Allocation</h3>
            <p className="text-sm text-gray-500 mb-2">Percentage of your assets to allocate to savings: {savingsPercentage}%</p>
            <input 
              type="range" 
              min="10" 
              max="90" 
              step="5"
              value={savingsPercentage}
              onChange={(e) => setSavingsPercentage(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>50%</span>
              <span>90%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg mb-6 flex">
          <Info size={20} className="text-yellow-600 mr-3 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            Funds in your savings account will take up to 1 hour to withdraw due to blockchain confirmation times.
          </p>
        </div>

        {authError && (
          <div className="bg-red-50 p-4 rounded-lg mb-6 flex">
            <X size={20} className="text-red-600 mr-3 flex-shrink-0" />
            <p className="text-sm text-red-800">{authError}</p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={() => setShowSetupModal(false)}
            disabled={isAuthenticating}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirmSetup}
            disabled={isAuthenticating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center relative"
          >
            {isAuthenticating ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
                <span className="opacity-0">Create Account</span>
              </>
            ) : (
              <>
                <Fingerprint size={16} className="mr-2" />
                Sign & Create Account
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  // Empty state for a newly created savings account with no deposits
  const renderEmptySavingsAccount = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Award size={24} className="text-blue-600" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Your Savings Account is Ready!</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Your account has been set up successfully. Deposit assets to start earning rewards.
      </p>
      <button className="bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors">
        Make Your First Deposit
      </button>
    </div>
  )

  // Regular dashboard with zero balances
  const renderZeroBalanceDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#C7CEEA] to-[#A7B4E0] rounded-xl p-6 text-black shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-1">Total Rewards</h2>
              <p className="text-sm opacity-80 mb-4">Lifetime earnings</p>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">0.00</span>
                <span className="ml-2 font-medium">XLM</span>
              </div>
              <p className="text-sm mt-1 opacity-80">≈ $0.00 USD</p>
            </div>
            <div className="bg-white bg-opacity-30 p-3 rounded-full">
              <Award size={24} />
            </div>
          </div>
          <div className="mt-6 flex items-center">
            <div className="flex-1">
              <div className="h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: "5%" }}></div>
              </div>
            </div>
            <span className="ml-3 text-sm font-medium">Level 1</span>
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
              <p className="font-semibold">+0.00 XLM</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <Award size={18} />
                </div>
                <div>
                  <p className="font-medium">Referral Bonus</p>
                  <p className="text-sm text-gray-500">0 referrals</p>
                </div>
              </div>
              <p className="font-semibold">+0.00 XLM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f8f9fc] rounded-xl p-5 border border-blue-100 mb-6">
        <div className="flex items-start">
          <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
            <Info size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-1">Your Savings Account is Active</h3>
            <p className="text-sm text-blue-700">
              Your account is set up with {autoManage ? "automatic management" : "manual management"}{" "}
              {autoManage && `and ${savingsPercentage}% allocation to savings`}. Deposit assets to start earning rewards.
            </p>
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
  )

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Rewards & Earning</h1>
          <p className="text-gray-600 mt-1">Grow your crypto through staking and rewards</p>
        </div>

        {(!isNewUser || savingsAccountCreated) && (
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
        )}
      </div>

      {isNewUser && !savingsAccountCreated ? (
        // New user view - show program info and setup option
        renderNewUserContent()
      ) : savingsAccountCreated && activeTab === "earn" && !autoManage ? (
        // Newly created account with zero balances - manual management view
        renderEmptySavingsAccount()
      ) : savingsAccountCreated && activeTab === "earn" && autoManage ? (
        // Newly created account with auto-management - show regular dashboard with zero values
        renderZeroBalanceDashboard()
      ) : activeTab === "earn" && (
        // Regular user view - existing rewards dashboard
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#C7CEEA] to-[#A7B4E0] rounded-xl p-6 text-black shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Total Rewards</h2>
                  <p className="text-sm opacity-80 mb-4">Lifetime earnings</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">0.00</span>
                    <span className="ml-2 font-medium">XLM</span>
                  </div>
                  <p className="text-sm mt-1 opacity-80">≈ $0.00 USD</p>
                </div>
                <div className="bg-white bg-opacity-30 p-3 rounded-full">
                  <Award size={24} />
                </div>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-1">
                  <div className="h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "5%" }}></div>
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium">Level 1</span>
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
                  <p className="font-semibold">+0.00 XLM</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <Award size={18} />
                    </div>
                    <div>
                      <p className="font-medium">Referral Bonus</p>
                      <p className="text-sm text-gray-500">0 referrals</p>
                    </div>
                  </div>
                  <p className="font-semibold">+0.00 XLM</p>
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

            <div className="text-center py-10 text-gray-500">
              <p>You don't have any staked assets yet.</p>
              <button className="mt-4 bg-[#C7CEEA] text-black font-medium py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center mx-auto">
                Stake Assets Now
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Staking Rewards</h2>

            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-500">Total rewards earned</p>
                <p className="text-2xl font-bold mt-1">0.00 XLM</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next reward</p>
                <div className="flex items-center mt-1">
                  <Clock size={16} className="text-gray-500 mr-1" />
                  <p className="font-medium">Deposit to earn</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Reward Rate</p>
                <p className="font-medium">Estimated Annual Yield</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500">0.000 XLM per day</p>
                <p className="text-green-600 font-medium">≈ $0.00 USD</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Reward History</h2>
          
          <div className="text-center py-10 text-gray-500">
            <p>No reward history yet. Start earning to see your rewards here.</p>
          </div>
        </div>
      )}

      {showSetupModal && renderSetupModal()}
    </div>
  )
} 