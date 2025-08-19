"use client"

import {
  Activity,
  BarChart3,
  Users,
  Pill,
  ClipboardCheck,
  Stethoscope,
  Heart,
  Settings,
  Shield,
  LogOut,
  X,
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeSection: string
  onSectionChange: (section: string) => void
  onLogout: () => void
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, section: "main" },
  { id: "staff", label: "Staff Management", icon: Users, section: "main" },
  { id: "inventory", label: "Inventory", icon: Pill, section: "main" },
  { id: "registration", label: "Registration", icon: ClipboardCheck, section: "patient" },
  { id: "diagnosis", label: "Diagnosis", icon: Stethoscope, section: "patient" },
  { id: "monitoring", label: "Monitoring", icon: Heart, section: "patient" },
  { id: "settings", label: "System Settings", icon: Settings, section: "settings" },
  { id: "security", label: "Security & Compliance", icon: Shield, section: "settings" },
]

const sections = [
  { id: "main", label: "Main" },
  { id: "patient", label: "Patient Loops" },
  { id: "settings", label: "Settings" },
]

export function Sidebar({ isOpen, onClose, activeSection, onSectionChange, onLogout }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BAHATI Hospital</h1>
                <p className="text-xs text-gray-500">Hospital Management System</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.id} className="mb-6">
              <div className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.label}
              </div>
              {navigationItems
                .filter((item) => item.section === section.id)
                .map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSectionChange(item.id)
                        onClose()
                      }}
                      className={`
                        w-full flex items-center px-3 py-3 text-left text-gray-800 hover:bg-blue-50 transition-colors
                        ${isActive ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700" : ""}
                      `}
                    >
                      <Icon className="w-5 h-5 mr-3 text-gray-600" />
                      {item.label}
                    </button>
                  )
                })}
            </div>
          ))}

          {/* Logout */}
          <div className="px-3 border-t border-gray-200 pt-4">
            <button
              onClick={onLogout}
              className="w-full flex items-center px-3 py-3 text-left text-gray-800 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3 text-gray-600" />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}
