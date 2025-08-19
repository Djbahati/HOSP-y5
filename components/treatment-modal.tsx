"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Heart, Thermometer, Activity, Droplets, Clock, User, FileText, Printer } from "lucide-react"

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

interface TreatmentModalProps {
  treatment: Treatment
  onClose: () => void
  onStatusUpdate: (treatmentId: string, newStatus: Treatment["status"]) => void
}

const vitalSigns = {
  heartRate: "86 bpm",
  bloodPressure: "128/82",
  temperature: "98.7°F",
  oxygenSaturation: "97%",
}

const treatmentTimeline = [
  {
    time: "Today, 10:24 AM",
    event: "Patient admitted to Cardiology Department",
    status: "completed",
  },
  {
    time: "Today, 10:45 AM",
    event: "Initial examination completed by Dr. Chen",
    status: "completed",
  },
  {
    time: "Today, 11:15 AM",
    event: "ECG test performed",
    status: "completed",
  },
  {
    time: "Today, 11:45 AM",
    event: "Medication administered",
    status: "current",
  },
]

export function TreatmentModal({ treatment, onClose, onStatusUpdate }: TreatmentModalProps) {
  const [newStatus, setNewStatus] = useState<Treatment["status"]>(treatment.status)

  const handleStatusUpdate = () => {
    onStatusUpdate(treatment.id, newStatus)
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Patient Treatment Details</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Patient Name</h4>
                  <p className="text-base font-semibold text-gray-900">{treatment.patient}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Patient ID</h4>
                  <p className="text-base font-semibold text-gray-900">{treatment.patientId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Department</h4>
                  <p className="text-base font-semibold text-gray-900">{treatment.department}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Attending Doctor</h4>
                  <p className="text-base font-semibold text-gray-900">{treatment.doctor}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Current Status</h4>
                  <Badge className={treatment.statusClass}>{treatment.status}</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Treatment Started</h4>
                  <p className="text-base font-semibold text-gray-900">Today, {treatment.startTime}</p>
                </div>
              </CardContent>
            </Card>

            {/* Treatment Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Treatment Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900">
                  Cardiac evaluation, ECG monitoring, and medication adjustment for arrhythmia management. Patient
                  requires continuous monitoring and regular vital sign checks every 30 minutes.
                </p>
              </CardContent>
            </Card>

            {/* Treatment Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Treatment Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 border-l-2 border-gray-200 space-y-4">
                  {treatmentTimeline.map((item, index) => (
                    <div key={index} className="relative">
                      <div
                        className={`absolute -left-8 mt-1 w-4 h-4 rounded-full ${
                          item.status === "current" ? "bg-green-500" : "bg-blue-500"
                        }`}
                      />
                      <div>
                        <span className="text-xs text-gray-500">{item.time}</span>
                        <p className="text-sm text-gray-900">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vital Signs & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">Heart Rate</span>
                  </div>
                  <span className="font-semibold">{vitalSigns.heartRate}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Blood Pressure</span>
                  </div>
                  <span className="font-semibold">{vitalSigns.bloodPressure}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Temperature</span>
                  </div>
                  <span className="font-semibold">{vitalSigns.temperature}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Oxygen Saturation</span>
                  </div>
                  <span className="font-semibold">{vitalSigns.oxygenSaturation}</span>
                </div>
              </CardContent>
            </Card>

            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">New Status</label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Treatment["status"])}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Treatment">In Treatment</SelectItem>
                      <SelectItem value="Awaiting Tests">Awaiting Tests</SelectItem>
                      <SelectItem value="Post-Op Recovery">Post-Op Recovery</SelectItem>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Critical Care">Critical Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleStatusUpdate} className="flex-1">
                    Update Status
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
