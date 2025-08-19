"use client"

import { Search, Bell, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface User {
  username: string
  role: string
}

interface HeaderProps {
  user: User | null
  onMenuToggle: () => void
  onLogout: () => void
}

export function Header({ user, onMenuToggle, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={onMenuToggle} className="lg:hidden mr-4">
          <Menu className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input type="text" placeholder="Search..." className="w-64 pl-10 pr-4 py-2 text-sm" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/doctor-avatar.png" />
            <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">Dr. {user?.username || "User"}</p>
            <p className="text-xs text-gray-500">{user?.role || "Role"}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
