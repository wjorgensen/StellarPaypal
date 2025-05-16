"use client"

import { useState } from "react"
import { ChevronDown, Search, Users, Clock, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function SendRequestPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "send")
  const [amount, setAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState("XLM")
  const [recipient, setRecipient] = useState("")
  const [note, setNote] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const assets = [
    { symbol: "XLM", name: "Stellar Lumens", balance: "120.5" },
    { symbol: "USDC", name: "USD Coin", balance: "25.0" }
  ]

  const recentContacts = [
    { id: 1, name: "Maria Johnson", username: "@maria", image: "/placeholder.svg" },
    { id: 2, name: "John Smith", username: "@johnsmith", image: "/placeholder.svg" },
    { id: 3, name: "Sarah Williams", username: "@sarahw", image: "/placeholder.svg" },
  ]

  const handleSend = () => {
    // In a real implementation, this would send the transaction
    console.log({
      type: "send",
      recipient,
      amount,
      asset: selectedAsset,
      note
    });
    
    alert("Transaction initiated!");
  }

  const handleRequest = () => {
    // In a real implementation, this would create a payment request
    console.log({
      type: "request",
      from: recipient,
      amount,
      asset: selectedAsset,
      note
    });
    
    alert("Payment request sent!");
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          {activeTab === "send" ? "Send Payment" : "Request Payment"}
        </h1>
        <p className="text-gray-600 mt-1">
          {activeTab === "send" 
            ? "Send assets to another wallet or user" 
            : "Request payment from another user"}
        </p>
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("send")}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            activeTab === "send"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="flex items-center justify-center">
            <ArrowUpRight size={18} className="mr-2" />
            Send
          </span>
        </button>
        <button
          onClick={() => setActiveTab("request")}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            activeTab === "request"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="flex items-center justify-center">
            <ArrowDownLeft size={18} className="mr-2" />
            Request
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Amount</h2>
              <div className="flex">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 p-3 border border-gray-200 rounded-l-lg text-2xl"
                />
                <div className="relative">
                  <button className="h-full px-4 bg-gray-100 border border-l-0 border-gray-200 rounded-r-lg font-medium flex items-center">
                    {selectedAsset}
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                  {/* Asset dropdown would go here */}
                </div>
              </div>
              {selectedAsset === "XLM" && (
                <p className="text-sm text-gray-500 mt-2">Available: 120.5 XLM</p>
              )}
              {selectedAsset === "USDC" && (
                <p className="text-sm text-gray-500 mt-2">Available: 25.0 USDC</p>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">
                {activeTab === "send" ? "To" : "From"}
              </h2>
              <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={activeTab === "send" ? "Enter Stellar address or username" : "Enter username"}
                  className="flex-1 outline-none"
                />
                <button className="text-gray-400">
                  <Search size={18} />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Note (Optional)</h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this payment for?"
                className="w-full p-3 border border-gray-200 rounded-lg min-h-[100px]"
              />
            </div>

            <button
              onClick={activeTab === "send" ? handleSend : handleRequest}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              {activeTab === "send" ? "Send Payment" : "Request Payment"}
            </button>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-medium mb-4">Assets</h2>
            
            <div className="space-y-3">
              {assets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset.symbol)}
                  className={`flex justify-between items-center w-full p-3 rounded-lg border ${
                    selectedAsset === asset.symbol
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#C7CEEA] flex items-center justify-center mr-2 text-sm">
                      {asset.symbol}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{asset.name}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{asset.balance}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Recent</h2>
              <div className="flex space-x-2">
                <button className="p-1 rounded hover:bg-gray-100">
                  <Users size={18} className="text-gray-500" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100">
                  <Clock size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="w-full p-2 pl-8 border border-gray-200 rounded-lg text-sm"
              />
              <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="space-y-2">
              {recentContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setRecipient(contact.username)}
                  className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.username}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 