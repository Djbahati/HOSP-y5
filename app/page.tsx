"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { HospitalDashboard } from "@/components/hospital-dashboard"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)

  const handleLogin = (username: string, password: string) => {
    // Simple authentication logic matching the original
    const validCredentials = [
      { username: "admin", password: "admin123", role: "Administrator" },
      { username: "doctor", password: "doc123", role: "Doctor" },
      { username: "nurse", password: "nurse123", role: "Nurse" },
    ]

    const user = validCredentials.find((cred) => cred.username === username && cred.password === password)

    if (user) {
      setUser({ username: user.username, role: user.role })
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <HospitalDashboard user={user} onLogout={handleLogout} />
}
