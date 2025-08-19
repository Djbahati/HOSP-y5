"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { InventoryModal } from "@/components/inventory-modal"
import { Pill, AlertTriangle, Package, Search, FileDown, Plus, Expand } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: "Medications" | "Supplies" | "Equipment" | "PPE"
  currentStock: number
  minThreshold: number
  maxCapacity: number
  unit: string
  supplier: string
  lastRestocked: string
  expiryDate?: string
  cost: number
  location: string
}

const inventoryData: InventoryItem[] = [
  {
    id: "INV001",
    name: "Antibiotics - Amoxicillin",
    category: "Medications",
    currentStock: 85,
    minThreshold: 20,
    maxCapacity: 200,
    unit: "boxes",
    supplier: "PharmaCorp",
    lastRestocked: "2025-01-10",
    expiryDate: "2025-12-31",
    cost: 45.99,
    location: "Pharmacy - A1",
  },
  {
    id: "INV002",
    name: "Pain Relief - Ibuprofen",
    category: "Medications",
    currentStock: 12,
    minThreshold: 30,
    maxCapacity: 150,
    unit: "bottles",
    supplier: "MediSupply",
    lastRestocked: "2025-01-05",
    expiryDate: "2025-08-15",
    cost: 28.5,
    location: "Pharmacy - B2",
  },
  {
    id: "INV003",
    name: "Surgical Gloves (L)",
    category: "PPE",
    currentStock: 145,
    minThreshold: 100,
    maxCapacity: 500,
    unit: "boxes",
    supplier: "SafetyFirst",
    lastRestocked: "2025-01-12",
    cost: 15.75,
    location: "Storage - C3",
  },
  {
    id: "INV004",
    name: "N95 Masks",
    category: "PPE",
    currentStock: 23,
    minThreshold: 50,
    maxCapacity: 300,
    unit: "boxes",
    supplier: "ProtectMed",
    lastRestocked: "2025-01-08",
    cost: 89.99,
    location: "Storage - D1",
  },
  {
    id: "INV005",
    name: "Insulin",
    category: "Medications",
    currentStock: 8,
    minThreshold: 15,
    maxCapacity: 50,
    unit: "vials",
    supplier: "DiabetesCare",
    lastRestocked: "2025-01-14",
    expiryDate: "2025-06-30",
    cost: 125.0,
    location: "Pharmacy - Cold Storage",
  },
  {
    id: "INV006",
    name: "Bandages - Sterile",
    category: "Supplies",
    currentStock: 67,
    minThreshold: 40,
    maxCapacity: 200,
    unit: "packs",
    supplier: "WoundCare Inc",
    lastRestocked: "2025-01-11",
    cost: 12.25,
    location: "Supply Room - E2",
  },
]

export function InventoryManagement() {
  const [items, setItems] = useState<InventoryItem[]>(inventoryData)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const getStockStatus = (item: InventoryItem): "critical" | "low" | "normal" | "high" => {
    const percentage = (item.currentStock / item.maxCapacity) * 100
    if (item.currentStock <= item.minThreshold * 0.5) return "critical"
    if (item.currentStock <= item.minThreshold) return "low"
    if (percentage > 80) return "high"
    return "normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500"
      case "low":
        return "bg-yellow-500"
      case "normal":
        return "bg-green-500"
      case "high":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "low":
        return "bg-yellow-100 text-yellow-800"
      case "normal":
        return "bg-green-100 text-green-800"
      case "high":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const status = getStockStatus(item)
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "low" && (status === "low" || status === "critical")) ||
      (filterStatus === "normal" && status === "normal") ||
      (filterStatus === "high" && status === "high")

    return matchesCategory && matchesSearch && matchesStatus
  })

  const handleRestock = (itemId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              currentStock: Math.min(item.currentStock + quantity, item.maxCapacity),
              lastRestocked: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    )
  }

  const criticalItems = items.filter((item) => getStockStatus(item) === "critical").length
  const lowStockItems = items.filter((item) => getStockStatus(item) === "low").length

  return (
    <>
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-orange-500" />
              Pharmacy Inventory
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Expand className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Alerts */}
          {(criticalItems > 0 || lowStockItems > 0) && (
            <div className="mb-4 space-y-2">
              {criticalItems > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      {criticalItems} item{criticalItems > 1 ? "s" : ""} critically low
                    </span>
                  </div>
                </div>
              )}
              {lowStockItems > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      {lowStockItems} item{lowStockItems > 1 ? "s" : ""} need restocking
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search and Filters */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Medications">Medications</SelectItem>
                  <SelectItem value="Supplies">Supplies</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="PPE">PPE</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Inventory Items */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredItems.map((item) => {
              const status = getStockStatus(item)
              const percentage = Math.round((item.currentStock / item.maxCapacity) * 100)

              return (
                <div
                  key={item.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <Badge className={getStatusBadgeColor(status)}>{status}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">
                        {item.currentStock} / {item.maxCapacity} {item.unit}
                      </span>
                      <span className="font-medium">{percentage}%</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(status)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    {status === "critical" || status === "low" ? (
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRestock(item.id, item.minThreshold)
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Restock Now
                      </Button>
                    ) : null}
                  </div>
                </div>
              )
            })}

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No items found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Total Items:</span>
                <span className="font-semibold ml-2">{items.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Low Stock:</span>
                <span className="font-semibold ml-2 text-yellow-600">{lowStockItems + criticalItems}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Details Modal */}
      {selectedItem && (
        <InventoryModal item={selectedItem} onClose={() => setSelectedItem(null)} onRestock={handleRestock} />
      )}
    </>
  )
}
