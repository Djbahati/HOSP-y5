"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BedModal } from "@/components/bed-modal"
import { Bed, Expand, Building } from "lucide-react"

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

interface Floor {
  id: string
  name: string
  totalBeds: number
  availableBeds: number
  beds: BedInfo[]
}

const generateBedData = (): Floor[] => [
  {
    id: "floor3",
    name: "Floor 3 - General Medicine",
    totalBeds: 30,
    availableBeds: 12,
    beds: Array.from({ length: 30 }, (_, i) => {
      const roomNumber = `3${String(i + 1).padStart(2, "0")}`
      const statuses: BedInfo["status"][] = ["available", "occupied", "reserved", "maintenance"]
      const status = statuses[Math.floor(Math.random() * statuses.length)]

      return {
        id: `bed-${roomNumber}`,
        roomNumber,
        status,
        patientId:
          status === "occupied" ? `P-2025-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}` : undefined,
        patientName: status === "occupied" ? `Patient ${i + 1}` : undefined,
        admissionDate: status === "occupied" ? "2025-01-15" : undefined,
        expectedDischarge: status === "occupied" ? "2025-01-20" : undefined,
        notes: status === "maintenance" ? "Routine maintenance scheduled" : undefined,
      }
    }),
  },
  {
    id: "floor2",
    name: "Floor 2 - Surgery",
    totalBeds: 25,
    availableBeds: 8,
    beds: Array.from({ length: 25 }, (_, i) => {
      const roomNumber = `2${String(i + 1).padStart(2, "0")}`
      const statuses: BedInfo["status"][] = ["available", "occupied", "reserved", "maintenance"]
      const status = statuses[Math.floor(Math.random() * statuses.length)]

      return {
        id: `bed-${roomNumber}`,
        roomNumber,
        status,
        patientId:
          status === "occupied" ? `P-2025-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}` : undefined,
        patientName: status === "occupied" ? `Patient ${i + 1}` : undefined,
        admissionDate: status === "occupied" ? "2025-01-14" : undefined,
        expectedDischarge: status === "occupied" ? "2025-01-18" : undefined,
        notes: status === "maintenance" ? "Equipment upgrade in progress" : undefined,
      }
    }),
  },
  {
    id: "floor4",
    name: "Floor 4 - Cardiology",
    totalBeds: 20,
    availableBeds: 5,
    beds: Array.from({ length: 20 }, (_, i) => {
      const roomNumber = `4${String(i + 1).padStart(2, "0")}`
      const statuses: BedInfo["status"][] = ["available", "occupied", "reserved", "maintenance"]
      const status = statuses[Math.floor(Math.random() * statuses.length)]

      return {
        id: `bed-${roomNumber}`,
        roomNumber,
        status,
        patientId:
          status === "occupied" ? `P-2025-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}` : undefined,
        patientName: status === "occupied" ? `Patient ${i + 1}` : undefined,
        admissionDate: status === "occupied" ? "2025-01-16" : undefined,
        expectedDischarge: status === "occupied" ? "2025-01-22" : undefined,
        notes: status === "maintenance" ? "Cardiac monitoring system update" : undefined,
      }
    }),
  },
]

export function BedMapping() {
  const [floors] = useState<Floor[]>(generateBedData())
  const [selectedFloor, setSelectedFloor] = useState<string>("floor3")
  const [selectedBed, setSelectedBed] = useState<BedInfo | null>(null)

  const currentFloor = floors.find((floor) => floor.id === selectedFloor) || floors[0]

  const getBedStatusColor = (status: BedInfo["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-200 border-green-600 hover:bg-green-300"
      case "occupied":
        return "bg-red-200 border-red-600 hover:bg-red-300"
      case "reserved":
        return "bg-yellow-200 border-yellow-600 hover:bg-yellow-300"
      case "maintenance":
        return "bg-gray-200 border-gray-600 hover:bg-gray-300"
      default:
        return "bg-gray-200 border-gray-600"
    }
  }

  const getStatusStats = (floor: Floor) => {
    const stats = floor.beds.reduce(
      (acc, bed) => {
        acc[bed.status] = (acc[bed.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      available: stats.available || 0,
      occupied: stats.occupied || 0,
      reserved: stats.reserved || 0,
      maintenance: stats.maintenance || 0,
    }
  }

  const stats = getStatusStats(currentFloor)

  return (
    <>
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-green-500" />
              Bed Occupancy
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Expand className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Building className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Floor Selection */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Floor:</span>
              <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {floors.map((floor) => (
                    <SelectItem key={floor.id} value={floor.id}>
                      {floor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">{stats.available} Available</div>
              <div className="text-xs text-gray-600">/ {currentFloor.totalBeds} Total</div>
            </div>
          </div>

          {/* Bed Map */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="text-sm font-medium">
                Nurses Station
              </Badge>
            </div>

            {/* Bed Grid Layout */}
            <div className="grid grid-cols-6 gap-2 justify-items-center">
              {currentFloor.beds.map((bed) => (
                <button
                  key={bed.id}
                  onClick={() => setSelectedBed(bed)}
                  className={`
                    relative w-8 h-12 border-2 rounded-sm transition-all duration-200 group
                    ${getBedStatusColor(bed.status)}
                  `}
                  title={`Room ${bed.roomNumber} - ${bed.status}`}
                >
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                    {bed.roomNumber}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    <div>Room {bed.roomNumber}</div>
                    <div className="capitalize">{bed.status}</div>
                    {bed.patientName && <div>{bed.patientName}</div>}
                  </div>
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-200 border border-green-600 rounded"></span>
                <span className="text-gray-600">Available ({stats.available})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-200 border border-red-600 rounded"></span>
                <span className="text-gray-600">Occupied ({stats.occupied})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-200 border border-yellow-600 rounded"></span>
                <span className="text-gray-600">Reserved ({stats.reserved})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-200 border border-gray-600 rounded"></span>
                <span className="text-gray-600">Maintenance ({stats.maintenance})</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Occupancy Rate:</span>
                <span className="font-semibold ml-2">
                  {Math.round(((currentFloor.totalBeds - stats.available) / currentFloor.totalBeds) * 100)}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">Turnover Today:</span>
                <span className="font-semibold ml-2">{Math.floor(Math.random() * 8) + 3}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bed Details Modal */}
      {selectedBed && <BedModal bed={selectedBed} floorName={currentFloor.name} onClose={() => setSelectedBed(null)} />}
    </>
  )
}
