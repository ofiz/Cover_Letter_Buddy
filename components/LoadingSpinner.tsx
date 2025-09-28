'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'

interface LoadingSpinnerProps {
  message?: string
  isVisible: boolean
}

const loadingMessages = [
  "Analyzing your resume...",
  "Understanding the job requirements...",
  "Crafting the perfect introduction...",
  "Highlighting your key strengths...",
  "Polishing the final touches..."
]

export default function LoadingSpinner({ 
  message = "Creating your perfect cover letter...", 
  isVisible 
}: LoadingSpinnerProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0)

  React.useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {/* Main Spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-400 animate-pulse" />
      </div>

      {/* Dynamic Loading Message */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-white">
          {message}
        </h3>
        <p className="text-indigo-300 text-sm transition-all duration-500">
          {loadingMessages[currentMessageIndex]}
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex space-x-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentMessageIndex 
                ? 'bg-indigo-400 scale-125' 
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-indigo-400/30 rounded-full animate-bounce`}
            style={{
              left: `${20 + i * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  )
}