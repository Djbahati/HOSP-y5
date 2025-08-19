"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, Clock, Users, Activity, Expand } from "lucide-react"

interface DepartmentData {
  name: string
  patientThroughput: number[]
  waitTimes: number[]
  satisfaction: number
  staffCount: number
  utilization: number
  color: string
}

const departmentData: DepartmentData[] = [
  {
    name: "Cardiology",
    patientThroughput: [31, 40, 28, 51, 42, 109, 100],
    waitTimes: [15, 18, 12, 25, 20, 35, 30],
    satisfaction: 4.2,
    staffCount: 12,
    utilization: 85,
    color: "#3b82f6",
  },
  {
    name: "Orthopedics",
    patientThroughput: [11, 32, 45, 32, 34, 52, 41],
    waitTimes: [22, 28, 18, 30, 25, 40, 35],
    satisfaction: 4.0,
    staffCount: 8,
    utilization: 78,
    color: "#10b981",
  },
  {
    name: "Neurology",
    patientThroughput: [15, 11, 32, 18, 9, 24, 11],
    waitTimes: [18, 15, 20, 22, 16, 28, 25],
    satisfaction: 4.5,
    staffCount: 6,
    utilization: 65,
    color: "#f59e0b",
  },
  {
    name: "Pediatrics",
    patientThroughput: [12, 17, 21, 28, 32, 38, 40],
    waitTimes: [10, 12, 8, 15, 12, 18, 16],
    satisfaction: 4.7,
    staffCount: 10,
    utilization: 92,
    color: "#ef4444",
  },
  {
    name: "Emergency",
    patientThroughput: [45, 52, 38, 65, 58, 78, 72],
    waitTimes: [5, 8, 6, 12, 10, 15, 13],
    satisfaction: 3.8,
    staffCount: 15,
    utilization: 95,
    color: "#8b5cf6",
  },
]

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function DepartmentAnalytics() {
  const [selectedMetric, setSelectedMetric] = useState<"throughput" | "waitTimes" | "satisfaction">("throughput")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("7days")

  const getMetricData = (department: DepartmentData) => {
    switch (selectedMetric) {
      case "throughput":
        return department.patientThroughput
      case "waitTimes":
        return department.waitTimes
      case "satisfaction":
        return Array(7).fill(department.satisfaction)
      default:
        return department.patientThroughput
    }
  }

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case "throughput":
        return "Patient Throughput"
      case "waitTimes":
        return "Average Wait Time (minutes)"
      case "satisfaction":
        return "Patient Satisfaction (1-5)"
      default:
        return "Patient Throughput"
    }
  }

  const getMetricUnit = () => {
    switch (selectedMetric) {
      case "throughput":
        return "patients"
      case "waitTimes":
        return "min"
      case "satisfaction":
        return "/5"
      default:
        return ""
    }
  }

  const filteredDepartments =
    selectedDepartment === "all"
      ? departmentData
      : departmentData.filter((dept) => dept.name.toLowerCase() === selectedDepartment.toLowerCase())

  const maxValue = Math.max(...filteredDepartments.flatMap((dept) => getMetricData(dept)))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Chart */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                Department Performance
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Expand className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Metric:</span>
                <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as any)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="throughput">Patient Throughput</SelectItem>
                    <SelectItem value="waitTimes">Wait Times</SelectItem>
                    <SelectItem value="satisfaction">Satisfaction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Department:</span>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {departmentData.map((dept) => (
                      <SelectItem key={dept.name} value={dept.name.toLowerCase()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Period:</span>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80 w-full">
              <div className="flex items-end justify-between h-full border-b border-l border-gray-200 p-4">
                {days.map((day, dayIndex) => (
                  <div key={day} className="flex flex-col items-center flex-1">
                    <div className="flex items-end justify-center w-full h-full mb-2 gap-1">
                      {filteredDepartments.map((dept, deptIndex) => {
                        const value = getMetricData(dept)[dayIndex]
                        const height = (value / maxValue) * 100
                        return (
                          <div
                            key={dept.name}
                            className="flex flex-col items-center group relative"
                            style={{ width: `${100 / filteredDepartments.length}%` }}
                          >
                            <div
                              className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                              style={{
                                height: `${height}%`,
                                backgroundColor: dept.color,
                                minHeight: "4px",
                              }}
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {dept.name}: {value} {getMetricUnit()}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{day}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {filteredDepartments.map((dept) => (
                <div key={dept.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: dept.color }} />
                  <span className="text-sm text-gray-600">{dept.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              {getMetricLabel()} -{" "}
              {timeRange === "7days" ? "Last 7 days" : timeRange === "30days" ? "Last 30 days" : "Last 90 days"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Department Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentData.map((dept) => (
              <div key={dept.name} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                  <Badge
                    variant="outline"
                    className={
                      dept.utilization > 90
                        ? "text-red-600 border-red-200"
                        : dept.utilization > 80
                          ? "text-yellow-600 border-yellow-200"
                          : "text-green-600 border-green-200"
                    }
                  >
                    {dept.utilization}% Utilization
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Staff: {dept.staffCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">
                      Avg Wait: {Math.round(dept.waitTimes.reduce((a, b) => a + b, 0) / dept.waitTimes.length)}min
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">
                      Daily Avg:{" "}
                      {Math.round(dept.patientThroughput.reduce((a, b) => a + b, 0) / dept.patientThroughput.length)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 flex items-center justify-center">
                      {dept.satisfaction >= 4.5 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : dept.satisfaction >= 4.0 ? (
                        <Activity className="h-3 w-3 text-yellow-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                    <span className="text-gray-600">Rating: {dept.satisfaction}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-green-800">Top Performer</div>
                  <div className="text-sm text-green-700">Pediatrics has the highest satisfaction rating at 4.7/5</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-yellow-800">Attention Needed</div>
                  <div className="text-sm text-yellow-700">
                    Emergency dept. has 95% utilization - consider additional staffing
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-800">Efficiency Leader</div>
                  <div className="text-sm text-blue-700">Pediatrics maintains shortest wait times at 12min average</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
