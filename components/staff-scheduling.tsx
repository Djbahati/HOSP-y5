"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StaffModal } from "@/components/staff-modal"
import { Users, ChevronLeft, ChevronRight, Calendar, Expand } from "lucide-react"

interface StaffDay {
  date: Date
  staffCount: number
  coverageLevel: "critical" | "low" | "moderate" | "good" | "excellent"
  isCurrentMonth: boolean
  isToday: boolean
  staff: StaffMember[]
}

interface StaffMember {
  id: string
  name: string
  role: "Doctor" | "Nurse" | "Technician" | "Administrator"
  shift: "Morning" | "Afternoon" | "Night"
  department: string
}

const generateStaffData = (): StaffMember[] => [
  { id: "1", name: "Dr. Sarah Chen", role: "Doctor", shift: "Morning", department: "Cardiology" },
  { id: "2", name: "Nurse Maria Lopez", role: "Nurse", shift: "Morning", department: "Emergency" },
  { id: "3", name: "Dr. James Wilson", role: "Doctor", shift: "Afternoon", department: "Neurology" },
  { id: "4", name: "Tech. Mike Johnson", role: "Technician", shift: "Night", department: "Radiology" },
  { id: "5", name: "Nurse Lisa Park", role: "Nurse", shift: "Night", department: "ICU" },
]

export function StaffScheduling() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<StaffDay | null>(null)

  const generateCalendarDays = (): StaffDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const today = new Date()

    // Get first day of month and calculate start of calendar
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days: StaffDay[] = []

    // Generate 35 days (5 weeks)
    for (let i = 0; i < 35; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const isCurrentMonth = date.getMonth() === month
      const isToday = date.toDateString() === today.toDateString()

      // Generate random staff data for demo
      const staffCount = Math.floor(Math.random() * 20) + 10
      const coverageLevel = getCoverageLevel(staffCount)
      const staff = generateStaffData()

      days.push({
        date,
        staffCount,
        coverageLevel,
        isCurrentMonth,
        isToday,
        staff,
      })
    }

    return days
  }

  const getCoverageLevel = (staffCount: number): StaffDay["coverageLevel"] => {
    if (staffCount < 15) return "critical"
    if (staffCount < 20) return "low"
    if (staffCount < 25) return "moderate"
    if (staffCount < 30) return "good"
    return "excellent"
  }

  const getCoverageBgColor = (level: StaffDay["coverageLevel"]) => {
    switch (level) {
      case "critical":
        return "bg-red-100 hover:bg-red-200"
      case "low":
        return "bg-orange-100 hover:bg-orange-200"
      case "moderate":
        return "bg-yellow-100 hover:bg-yellow-200"
      case "good":
        return "bg-green-100 hover:bg-green-200"
      case "excellent":
        return "bg-emerald-100 hover:bg-emerald-200"
      default:
        return "bg-gray-100 hover:bg-gray-200"
    }
  }

  const getCoverageTextColor = (level: StaffDay["coverageLevel"]) => {
    switch (level) {
      case "critical":
        return "text-red-800"
      case "low":
        return "text-orange-800"
      case "moderate":
        return "text-yellow-800"
      case "good":
        return "text-green-800"
      case "excellent":
        return "text-emerald-800"
      default:
        return "text-gray-800"
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const calendarDays = generateCalendarDays()
  const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <>
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Staff Availability
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Expand className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-700">{monthYear}</h4>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`
                  aspect-square p-1 text-xs border border-gray-200 transition-colors
                  ${getCoverageBgColor(day.coverageLevel)}
                  ${day.isCurrentMonth ? "" : "opacity-50"}
                  ${day.isToday ? "ring-2 ring-blue-500" : ""}
                `}
              >
                <div
                  className={`font-medium ${day.isToday ? "text-blue-800" : getCoverageTextColor(day.coverageLevel)}`}
                >
                  {day.date.getDate()}
                </div>
                <div className="text-xs text-gray-600 mt-1">{day.staffCount}</div>
              </button>
            ))}
          </div>

          {/* Coverage Legend */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600 mb-2">Staff Coverage Level:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-200 rounded"></span>
                <span className="text-gray-600">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-200 rounded"></span>
                <span className="text-gray-600">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-200 rounded"></span>
                <span className="text-gray-600">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-200 rounded"></span>
                <span className="text-gray-600">Good</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-200 rounded"></span>
                <span className="text-gray-600">Excellent</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Today's Staff:</span>
                <span className="font-semibold ml-2">{calendarDays.find((day) => day.isToday)?.staffCount || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Coverage:</span>
                <Badge
                  className={`ml-2 ${getCoverageBgColor(calendarDays.find((day) => day.isToday)?.coverageLevel || "moderate")} ${getCoverageTextColor(calendarDays.find((day) => day.isToday)?.coverageLevel || "moderate")}`}
                >
                  {calendarDays.find((day) => day.isToday)?.coverageLevel || "moderate"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Details Modal */}
      {selectedDay && <StaffModal day={selectedDay} onClose={() => setSelectedDay(null)} />}
    </>
  )
}
