"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { signupWithPasskey } from "@/lib/wallet-auth"

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }
    
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email")
      return
    }
    
    try {
      setError("")
      setIsRegistering(true)
      
      // Mock admin key - in a real app, this would be securely handled
      const adminPublicKey = "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"
      
      // Store username in localStorage to use in dashboard
      localStorage.setItem("stellarPaypal_username", username)
      
      const result = await signupWithPasskey(username, adminPublicKey)
      
      if (result.success) {
        // Save wallet address to localStorage
        if (result.walletAddress) {
          localStorage.setItem("stellarPaypal_walletAddress", result.walletAddress)
        }
        
        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (error) {
      console.error("Error during registration:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#C7CEEA] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Image 
            src="/assets/mosaic.png" 
            alt="Stellar Paypal" 
            width={200} 
            height={70} 
            priority
          />
        </div>
        
        <h1 className="text-2xl font-semibold text-center mb-6">Create Your Account</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7CEEA]"
              placeholder="Enter username"
              disabled={isRegistering}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7CEEA]"
              placeholder="Enter email"
              disabled={isRegistering}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#C7CEEA] text-white font-medium py-3 rounded-lg hover:bg-opacity-90 transition-colors relative"
            disabled={isRegistering}
          >
            {isRegistering ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            ) : null}
            <span className={isRegistering ? "opacity-0" : "opacity-100"}>
              Sign up with Passkey
            </span>
          </button>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-[#C7CEEA] hover:underline"
            >
              Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 