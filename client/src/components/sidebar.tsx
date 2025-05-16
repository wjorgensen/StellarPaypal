"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Home, Wallet, Send, Award, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { getWalletData } from "@/lib/blockchain-data"

export default function Sidebar() {
  const pathname = usePathname()
  const [userInitials, setUserInitials] = useState("WJ")
  const [username, setUsername] = useState("User")
  const [handle, setHandle] = useState("@user")
  const [balance, setBalance] = useState("$0.00")
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  // Fetch user information from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get username
      const storedUsername = localStorage.getItem("stellarPaypal_username")
      if (storedUsername) {
        setUsername(storedUsername)
        
        // Generate initials from username
        const initials = storedUsername
          .split(" ")
          .map((name) => name[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
        
        setUserInitials(initials || "US")
        
        // Generate handle
        setHandle(`@${storedUsername.replace(/\s+/g, "-")}`)
      }
      
      // Get wallet address
      const storedWalletAddress = localStorage.getItem("stellarPaypal_walletAddress")
      if (storedWalletAddress) {
        setWalletAddress(storedWalletAddress)
        setWalletConnected(true)
      }
      
      // Get wallet info from the wallet page
      const storedWalletInfo = localStorage.getItem("walletInfo")
      if (storedWalletInfo) {
        setWalletConnected(true)
      }
    }
  }, [])
  
  // Fetch wallet balance
  useEffect(() => {
    async function fetchBalance() {
      if (walletConnected) {
        try {
          const data = await getWalletData(walletAddress)
          setBalance(`$${data.totalBalance.toFixed(2)}`)
        } catch (error) {
          console.error("Error fetching wallet balance:", error)
        }
      }
    }
    
    fetchBalance()
  }, [walletConnected, walletAddress])

  // Memoize the paint strokes to ensure they don't re-render on navigation
  const paintStrokes = useMemo(
    () => (
      <>
        {[
          { src: "/assets/longStrokeP.png", top: "10%", left: "5%", rotate: "15deg", opacity: "0.3", width: 300 },
          { src: "/assets/fatStrokeW.png", bottom: "30%", right: "5%", rotate: "-10deg", opacity: "0.3", width: 250 },
          { src: "/assets/longUpP.png", top: "50%", left: "10%", rotate: "5deg", opacity: "0.25", width: 280 },
          { src: "/assets/longStrokeP.png", top: "75%", right: "8%", rotate: "20deg", opacity: "0.2", width: 240 },
          { src: "/assets/fatStrokeP.png", top: "25%", right: "15%", rotate: "-15deg", opacity: "0.25", width: 220 },
        ].map((stroke, index) => (
          <div
            key={index}
            className="absolute pointer-events-none z-0"
            style={{
              top: stroke.top || "auto",
              left: stroke.left || "auto",
              right: stroke.right || "auto",
              bottom: stroke.bottom || "auto",
              transform: `rotate(${stroke.rotate})`,
              opacity: stroke.opacity,
              width: `${stroke.width * 0.6}px`, // Reduced size
            }}
          >
            <Image
              src={stroke.src || "/placeholder.svg"}
              alt=""
              width={stroke.width}
              height={stroke.width / 3}
              priority
            />
          </div>
        ))}
      </>
    ),
    [],
  )

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: "/dashboard", icon: <Home size={20} />, label: "Home" },
    { href: "/dashboard/wallet", icon: <Wallet size={20} />, label: "Wallet" },
    { href: "/dashboard/send-request", icon: <Send size={20} />, label: "Send & Request" },
    { href: "/dashboard/interest", icon: <Award size={20} />, label: "Rewards" },
    { href: "/dashboard/settings", icon: <Settings size={20} />, label: "Settings" },
  ]

  return (
    <div className="w-[280px] min-h-screen bg-gradient-to-b from-[#C7CEEA] to-[#C7CEEA]/90 text-black flex flex-col shadow-sm relative overflow-hidden">
      {paintStrokes}

      <div className="relative z-10 p-6">
        <div className="mb-8">
          <Image 
            src="/assets/mosaic.png" 
            alt="Mosaic" 
            width={150} 
            height={50} 
            priority
          />
        </div>

        <div className="flex items-center mb-3">
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#C7CEEA] font-bold mr-3">
            {userInitials}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{username}</h2>
            <p className="text-sm text-gray-700">{handle}</p>
          </div>
        </div>

        <div className="mb-5 bg-white bg-opacity-30 backdrop-blur-sm p-4 rounded-xl">
          <p className="text-2xl font-bold">{balance}</p>
          <Link href="/dashboard/wallet" className="text-sm text-blue-700 hover:text-blue-800 transition-colors">
            {walletConnected ? "View wallet" : "Connect wallet"}
          </Link>
        </div>

        <Link href="/dashboard/send-request">
          <button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center mb-8 shadow-sm">
            <span>Pay or Request</span>
          </button>
        </Link>
      </div>

      <nav className="flex-1 px-3 relative z-10">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-2.5 rounded-xl transition-all ${
                  isActive(item.href)
                    ? "bg-white bg-opacity-60 backdrop-blur-sm font-medium shadow-sm"
                    : "hover:bg-white hover:bg-opacity-20"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 relative z-10"></div>
    </div>
  )
} 