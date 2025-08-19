"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Bed, User, Calendar, Clock, AlertTriangle, Settings } from "lucide-react"
import { useState } from "react"

interface BedInfo {
  id: string
  roomNumber: string
  status: "available" | "occupied" | "reserved" | "maintenance"
  patientId?: string
  patientName?: string
  admissionDate?: string
  expectedDischarge?: string
  notes?: string
}

interface BedModalProps {
  bed: BedInfo
  floorName: string
  onClose: () => void
}

export function BedModal({ bed, floorName, onClose }: BedModalProps) {
  const [newStatus, setNewStatus] = useState<BedInfo["status"]>(bed.status)

  const getStatusBadgeColor = (status: BedInfo["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-red-100 text-red-800"
      case "reserved":
        return "bg-yellow-100 text-yellow-800"
      case "maintenance":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: BedInfo["status"]) => {
    switch (status) {
      case "available":
        return <Bed className="h-4 w-4 text-green-600" />
      case "occupied":
        return <User className="h-4 w-4 text-red-600" />
      case "reserved":
        return <Calendar className="h-4 w-4 text-yellow-600" />
      case "maintenance":
        return <Settings className="h-4 w-4 text-gray-600" />
      default:
        return <Bed className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              <span>
                Room {bed.roomNumber} - {floorName}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bed Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(bed.status)}
                Bed Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge className={getStatusBadgeColor(bed.status)}>
                    {bed.status.charAt(0).toUpperCase() + bed.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">Room {bed.roomNumber}</div>
              </div>

              {bed.notes && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-yellow-800">Notes</div>
                      <div className="text-sm text-yellow-700">{bed.notes}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Information */}
          {bed.status === "occupied" && bed.patientId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Patient Name</div>
                    <div className="text-base font-semibold text-gray-900">{bed.patientName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Patient ID</div>
                    <div className="text-base font-semibold text-gray-900">{bed.patientId}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Admission Date</div>
                    <div className="text-base text-gray-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {bed.admissionDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Expected Discharge</div>
                    <div className="text-base text-gray-900 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {bed.expectedDischarge}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-500 mb-2">Length of Stay</div>
                  <div className="text-base text-gray-900">
                    {bed.admissionDate && bed.expectedDischarge
                      ? `${Math.ceil((new Date(bed.expectedDischarge).getTime() - new Date(bed.admissionDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                      : "N/A"}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bed Management */}
          <Card>
            <CardHeader>
              <CardTitle>Bed Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Update Status</label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as BedInfo["status"])}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Update Status</Button>
                {bed.status === "occupied" && <Button variant="outline">Discharge Patient</Button>}
                {bed.status === "available" && <Button variant="outline">Assign Patient</Button>}
              </div>
            </CardContent>
          </Card>

          {/* Room Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Room Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Private Bathroom</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>TV & WiFi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Cardiac Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Oxygen Supply</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Visitor Chair</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Emergency Call</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
