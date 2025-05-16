"use client"

import { useState } from "react"
import { Lock, User, Bell, Moon, Sun, Shield, ArrowRight, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [theme, setTheme] = useState("light")
  const [notifications, setNotifications] = useState({
    transactions: true,
    rewards: true,
    security: true,
    marketing: false,
  })

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    // In a real implementation, we would update the theme in localStorage and apply it
  }

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const renderTab = () => {
    switch(activeTab) {
      case "account":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium mb-4">Profile Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    defaultValue="Wes Jorgensen"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    defaultValue="@Wes-Jorgensen"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    defaultValue="wes@example.com"
                  />
                </div>
                
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium mb-4">Connected Wallets</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">Stellar Wallet</p>
                    <p className="text-sm text-gray-500 font-mono">G...X3Z9</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 text-sm">View</button>
                    <button className="text-red-600 text-sm">Disconnect</button>
                  </div>
                </div>
                
                <button className="flex items-center text-blue-600 font-medium">
                  <ArrowRight size={16} className="mr-1" />
                  Connect Another Wallet
                </button>
              </div>
            </div>
          </div>
        );
        
      case "security":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium mb-4">Password</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    placeholder="••••••••"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    placeholder="••••••••"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    placeholder="••••••••"
                  />
                </div>
                
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Update Password
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium mb-4">Two-Factor Authentication</h2>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center">
                  <Shield size={20} className="text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Enabled</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-red-100 text-red-600 rounded-md">Disable</button>
              </div>
              
              <p className="text-sm text-gray-600">
                Two-factor authentication adds an extra layer of security to your account.
                In addition to your password, you'll need a code from your phone to log in.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium mb-4 flex items-center text-red-600">
                <Trash2 size={20} className="mr-2" />
                Danger Zone
              </h2>
              
              <p className="text-sm text-gray-700 mb-4">
                Once you delete your account, there is no going back. This action cannot be undone.
              </p>
              
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        );
        
      case "preferences":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium mb-4">Appearance</h2>
              
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`flex items-center justify-center w-full p-4 rounded-lg border ${
                    theme === "light" ? "border-blue-600 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Sun size={24} className={theme === "light" ? "text-blue-600" : "text-gray-400"} />
                    <span className={`mt-2 ${theme === "light" ? "font-medium text-blue-600" : "text-gray-500"}`}>Light</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`flex items-center justify-center w-full p-4 rounded-lg border ${
                    theme === "dark" ? "border-blue-600 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Moon size={24} className={theme === "dark" ? "text-blue-600" : "text-gray-400"} />
                    <span className={`mt-2 ${theme === "dark" ? "font-medium text-blue-600" : "text-gray-500"}`}>Dark</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleThemeChange("system")}
                  className={`flex items-center justify-center w-full p-4 rounded-lg border ${
                    theme === "system" ? "border-blue-600 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex">
                      <Sun size={18} className={theme === "system" ? "text-blue-600" : "text-gray-400"} />
                      <Moon size={18} className={theme === "system" ? "text-blue-600" : "text-gray-400"} />
                    </div>
                    <span className={`mt-2 ${theme === "system" ? "font-medium text-blue-600" : "text-gray-500"}`}>System</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { key: 'transactions', label: 'Transaction Notifications', description: 'Get notified when you receive or send assets' },
                  { key: 'rewards', label: 'Reward Notifications', description: 'Get notified when you earn rewards' },
                  { key: 'security', label: 'Security Alerts', description: 'Get notified about security events like login attempts' },
                  { key: 'marketing', label: 'Marketing & Updates', description: 'Receive updates about new features and offers' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={() => handleNotificationToggle(item.key as keyof typeof notifications)}
                      />
                      <div className={`w-11 h-6 rounded-full transition ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        <div className={`absolute top-[2px] left-[2px] bg-white rounded-full w-5 h-5 transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4">
              <button
                onClick={() => setActiveTab("account")}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeTab === "account" ? "bg-[#C7CEEA] bg-opacity-30 text-blue-700" : "hover:bg-gray-50"
                }`}
              >
                <User size={20} className="mr-3" />
                <span className="font-medium">Account</span>
              </button>
              
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeTab === "security" ? "bg-[#C7CEEA] bg-opacity-30 text-blue-700" : "hover:bg-gray-50"
                }`}
              >
                <Lock size={20} className="mr-3" />
                <span className="font-medium">Security</span>
              </button>
              
              <button
                onClick={() => setActiveTab("preferences")}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeTab === "preferences" ? "bg-[#C7CEEA] bg-opacity-30 text-blue-700" : "hover:bg-gray-50"
                }`}
              >
                <Bell size={20} className="mr-3" />
                <span className="font-medium">Preferences</span>
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          {renderTab()}
        </div>
      </div>
    </div>
  )
} 