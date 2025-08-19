"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DashboardStats } from "@/components/dashboard-stats"
import { EmergencyAlert } from "@/components/emergency-alert"
import { TreatmentsTable } from "@/components/treatments-table"
import { StaffScheduling } from "@/components/staff-scheduling"
import { BedMapping } from "@/components/bed-mapping"
import { DepartmentAnalytics } from "@/components/department-analytics"
import { InventoryManagement } from "@/components/inventory-management"

interface User {
  username: string
  role: string
}

interface HospitalDashboardProps {
  user: User | null
  onLogout: () => void
}

export function HospitalDashboard({ user, onLogout }: HospitalDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onMenuToggle={() => setSidebarOpen(true)} onLogout={onLogout} />

        <EmergencyAlert />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {/* Dashboard Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hospital Overview</h1>
              <p className="text-gray-600">Real-time monitoring and management</p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                Last updated: <span className="font-medium">Just now</span>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <DashboardStats />

          <div className="mt-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Treatments Management - Takes up 2 columns */}
            <div className="xl:col-span-2">
              <TreatmentsTable />
            </div>

            {/* Side widgets */}
            <div className="space-y-6">
              <StaffScheduling />
              <BedMapping />
            </div>

            <div>
              <InventoryManagement />
            </div>
          </div>

          <div className="mt-6">
            <DepartmentAnalytics />
          </div>
        </main>
      </div>
    </div>
  )
}
