"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TreatmentModal } from "@/components/treatment-modal"
import { Activity, Filter, Expand } from "lucide-react"

interface Treatment {
  id: string
  patient: string
  patientId: string
  department: string
  status: "In Treatment" | "Awaiting Tests" | "Post-Op Recovery" | "Consultation" | "Critical Care"
  statusClass: string
  doctor: string
  startTime: string
  priority: "High" | "Medium" | "Low"
}

const treatmentData: Treatment[] = [
  {
    id: "T001",
    patient: "Sarah Johnson",
    patientId: "P-2025-0042",
    department: "Cardiology",
    status: "In Treatment",
    statusClass: "bg-red-100 text-red-800",
    doctor: "Dr. Michael Chen",
    startTime: "10:24 AM",
    priority: "High",
  },
  {
    id: "T002",
    patient: "Robert Williams",
    patientId: "P-2025-0189",
    department: "Orthopedics",
    status: "Awaiting Tests",
    statusClass: "bg-yellow-100 text-yellow-800",
    doctor: "Dr. Emily Taylor",
    startTime: "09:15 AM",
    priority: "Medium",
  },
  {
    id: "T003",
    patient: "James Thompson",
    patientId: "P-2025-0073",
    department: "Neurology",
    status: "Post-Op Recovery",
    statusClass: "bg-blue-100 text-blue-800",
    doctor: "Dr. Lisa Wong",
    startTime: "08:30 AM",
    priority: "Medium",
  },
  {
    id: "T004",
    patient: "Maria Rodriguez",
    patientId: "P-2025-0128",
    department: "Pediatrics",
    status: "Consultation",
    statusClass: "bg-green-100 text-green-800",
    doctor: "Dr. John Miller",
    startTime: "11:00 AM",
    priority: "Low",
  },
  {
    id: "T005",
    patient: "David Lee",
    patientId: "P-2025-0255",
    department: "Emergency",
    status: "Critical Care",
    statusClass: "bg-red-100 text-red-800",
    doctor: "Dr. Sarah Parker",
    startTime: "07:45 AM",
    priority: "High",
  },
]

export function TreatmentsTable() {
  const [treatments, setTreatments] = useState<Treatment[]>(treatmentData)
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null)
  const [sortBy, setSortBy] = useState("priority")
  const [filterBy, setFilterBy] = useState("all")

  const filteredAndSortedTreatments = treatments
    .filter((treatment) => {
      if (filterBy === "all") return true
      if (filterBy === "critical") return treatment.priority === "High"
      if (filterBy === "department") return treatment.department === "Cardiology"
      return true
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortBy === "time") return a.startTime.localeCompare(b.startTime)
      if (sortBy === "department") return a.department.localeCompare(b.department)
      return 0
    })

  const handleStatusUpdate = (treatmentId: string, newStatus: Treatment["status"]) => {
    setTreatments((prev) =>
      prev.map((treatment) =>
        treatment.id === treatmentId
          ? { ...treatment, status: newStatus, statusClass: getStatusClass(newStatus) }
          : treatment,
      ),
    )
  }

  const getStatusClass = (status: Treatment["status"]) => {
    switch (status) {
      case "In Treatment":
      case "Critical Care":
        return "bg-red-100 text-red-800"
      case "Awaiting Tests":
        return "bg-yellow-100 text-yellow-800"
      case "Post-Op Recovery":
        return "bg-blue-100 text-blue-800"
      case "Consultation":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Ongoing Treatments
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Expand className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Filter:</span>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="department">Cardiology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedTreatments.map((treatment) => (
                    <tr key={treatment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${getPriorityColor(treatment.priority)}`} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{treatment.patient}</div>
                            <div className="text-xs text-gray-500">{treatment.patientId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{treatment.department}</div>
                        <div className="text-xs text-gray-500">Started: {treatment.startTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={treatment.statusClass}>{treatment.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{treatment.doctor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTreatment(treatment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredAndSortedTreatments.length === 0 && (
            <div className="text-center py-8 text-gray-500">No treatments found matching the current filters.</div>
          )}
        </CardContent>
      </Card>

      {/* Treatment Modal */}
      {selectedTreatment && (
        <TreatmentModal
          treatment={selectedTreatment}
          onClose={() => setSelectedTreatment(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  )
}
