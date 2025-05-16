"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const router = useRouter()
  const [subtitle, setSubtitle] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const fullSubtitle = "A modern wallet powered by the Stellar blockchain."
  
  useEffect(() => {
    if (subtitle.length < fullSubtitle.length) {
      const timeout = setTimeout(() => {
        setSubtitle(fullSubtitle.slice(0, subtitle.length + 1))
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [subtitle, fullSubtitle])
  
  // blinkeeeing cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const handleSignUp = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#C7CEEA] relative overflow-hidden flex items-center justify-center">
      {/* Only use W-marked paint strokes */}
      <div className="absolute top-[20%] left-[10%] rotate-[-3.5deg] opacity-60">
        <Image src="/assets/lowStrokeW.png" alt="" width={500} height={200} priority />
      </div>

      <div className="absolute bottom-[45%] right-[15%] rotate-[7.5deg] opacity-50">
        <Image src="/assets/fatStrokeW.png" alt="" width={450} height={170} priority />
      </div>

      <div className="absolute top-[65%] left-[20%] rotate-[6deg] opacity-40">
        <Image src="/assets/longStrokeW.png" alt="" width={550} height={200} priority />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10 flex flex-col items-center">
        <div className="text-center mb-20">
          <div className="mb-16 inline-block">
            <Image 
              src="/assets/mosaic.png" 
              alt="Mosaic" 
              width={400} 
              height={140} 
              priority
              className="transform hover:scale-105 transition-transform duration-300 drop-shadow-lg"
            />
          </div>

          <h2 className="text-2xl md:text-3xl font-light text-black/80 mb-12 max-w-2xl mx-auto h-[40px]">
            {subtitle}
            <span className={`inline-block w-[2px] h-[1em] bg-black/80 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
          </h2>

          <button
            className="rounded-full px-12 py-5 bg-transparent text-white border-2 border-white 
            hover:bg-white hover:text-[#C7CEEA] transition-all duration-300 font-medium text-lg shadow-md
            hover:shadow-lg hover:scale-105"
            onClick={handleSignUp}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
} 