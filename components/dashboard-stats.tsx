"use client"

import { TrendingUp, TrendingDown, Users, Bed, UserCheck, Clock } from "lucide-react"

const stats = [
  {
    title: "Total Patients",
    value: "248",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "blue",
  },
  {
    title: "Available Beds",
    value: "42",
    change: "-8%",
    trend: "down",
    icon: Bed,
    color: "green",
  },
  {
    title: "Staff On Duty",
    value: "85",
    change: "+3%",
    trend: "up",
    icon: UserCheck,
    color: "purple",
  },
  {
    title: "Average Wait Time",
    value: "18 min",
    change: "-5%",
    trend: "up",
    icon: Clock,
    color: "yellow",
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
        const trendColor = stat.trend === "up" ? "text-green-600" : "text-red-600"

        return (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                <p className={`text-xs mt-1 flex items-center ${trendColor}`}>
                  <TrendIcon className="h-3 w-3 mr-1" />
                  <span>{stat.change} from yesterday</span>
                </p>
              </div>
              <div className={`p-3 rounded-full ${getIconBgColor(stat.color)}`}>
                <Icon className={`h-6 w-6 ${getIconColor(stat.color)}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getIconBgColor(color: string) {
  switch (color) {
    case "blue":
      return "bg-blue-100"
    case "green":
      return "bg-green-100"
    case "purple":
      return "bg-purple-100"
    case "yellow":
      return "bg-yellow-100"
    default:
      return "bg-gray-100"
  }
}

function getIconColor(color: string) {
  switch (color) {
    case "blue":
      return "text-blue-600"
    case "green":
      return "text-green-600"
    case "purple":
      return "text-purple-600"
    case "yellow":
      return "text-yellow-600"
    default:
      return "text-gray-600"
  }
}
