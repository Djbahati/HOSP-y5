"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"

export function EmergencyAlert() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show alert after 2 seconds (demo purposes)
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    // Hide alert after 8 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 8000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-20 right-4 z-30 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-80 shadow-lg rounded-md animate-in slide-in-from-right duration-500">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">Emergency: Code Blue in Cardiology</p>
          <p className="text-xs mt-1">Patient in Room 305 needs immediate attention</p>
        </div>
        <button onClick={() => setIsVisible(false)} className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
