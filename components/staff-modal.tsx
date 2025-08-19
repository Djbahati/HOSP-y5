"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Users, Clock, MapPin, Phone, Mail } from "lucide-react"

interface StaffMember {
  id: string
  name: string
  role: "Doctor" | "Nurse" | "Technician" | "Administrator"
  shift: "Morning" | "Afternoon" | "Night"
  department: string
}

interface StaffDay {
  date: Date
  staffCount: number
  coverageLevel: "critical" | "low" | "moderate" | "good" | "excellent"
  isCurrentMonth: boolean
  isToday: boolean
  staff: StaffMember[]
}

interface StaffModalProps {
  day: StaffDay
  onClose: () => void
}

const getShiftTime = (shift: string) => {
  switch (shift) {
    case "Morning":
      return "6:00 AM - 2:00 PM"
    case "Afternoon":
      return "2:00 PM - 10:00 PM"
    case "Night":
      return "10:00 PM - 6:00 AM"
    default:
      return "Unknown"
  }
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Doctor":
      return "bg-blue-100 text-blue-800"
    case "Nurse":
      return "bg-green-100 text-green-800"
    case "Technician":
      return "bg-purple-100 text-purple-800"
    case "Administrator":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getShiftBadgeColor = (shift: string) => {
  switch (shift) {
    case "Morning":
      return "bg-yellow-100 text-yellow-800"
    case "Afternoon":
      return "bg-orange-100 text-orange-800"
    case "Night":
      return "bg-indigo-100 text-indigo-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function StaffModal({ day, onClose }: StaffModalProps) {
  const formattedDate = day.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Group staff by shift
  const staffByShift = day.staff.reduce(
    (acc, member) => {
      if (!acc[member.shift]) {
        acc[member.shift] = []
      }
      acc[member.shift].push(member)
      return acc
    },
    {} as Record<string, StaffMember[]>,
  )

  // Generate additional staff for demo
  const allStaff = [
    ...day.staff,
    { id: "6", name: "Dr. Robert Kim", role: "Doctor" as const, shift: "Morning" as const, department: "Surgery" },
    {
      id: "7",
      name: "Nurse Jennifer Davis",
      role: "Nurse" as const,
      shift: "Afternoon" as const,
      department: "Pediatrics",
    },
    { id: "8", name: "Tech. David Brown", role: "Technician" as const, shift: "Night" as const, department: "Lab" },
    {
      id: "9",
      name: "Admin. Susan White",
      role: "Administrator" as const,
      shift: "Morning" as const,
      department: "Reception",
    },
    {
      id: "10",
      name: "Dr. Amanda Taylor",
      role: "Doctor" as const,
      shift: "Afternoon" as const,
      department: "Emergency",
    },
  ]

  const staffByShiftComplete = allStaff.reduce(
    (acc, member) => {
      if (!acc[member.shift]) {
        acc[member.shift] = []
      }
      acc[member.shift].push(member)
      return acc
    },
    {} as Record<string, StaffMember[]>,
  )

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Staff Schedule - {formattedDate}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-900">{day.staffCount}</div>
                <div className="text-sm text-gray-500">Total Staff</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {allStaff.filter((s) => s.role === "Doctor").length}
                </div>
                <div className="text-sm text-gray-500">Doctors</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {allStaff.filter((s) => s.role === "Nurse").length}
                </div>
                <div className="text-sm text-gray-500">Nurses</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {allStaff.filter((s) => s.role === "Technician").length}
                </div>
                <div className="text-sm text-gray-500">Technicians</div>
              </CardContent>
            </Card>
          </div>

          {/* Staff by Shift */}
          <div className="space-y-6">
            {["Morning", "Afternoon", "Night"].map((shift) => (
              <Card key={shift}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <span>{shift} Shift</span>
                      <Badge className={getShiftBadgeColor(shift)}>{getShiftTime(shift)}</Badge>
                    </div>
                    <Badge variant="outline">{staffByShiftComplete[shift]?.length || 0} Staff</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {staffByShiftComplete[shift]?.map((member) => (
                      <div key={member.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{member.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600">{member.department}</span>
                            </div>
                          </div>
                          <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>Ext. {Math.floor(Math.random() * 9000) + 1000}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>Available</span>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        No staff scheduled for this shift
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <Button variant="outline">Export Schedule</Button>
            <Button variant="outline">Request Coverage</Button>
            <Button>Manage Shifts</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
