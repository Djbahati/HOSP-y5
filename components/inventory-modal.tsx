"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Package, MapPin, Calendar, DollarSign, Truck, AlertTriangle, Plus, Minus } from "lucide-react"

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

interface InventoryModalProps {
  item: InventoryItem
  onClose: () => void
  onRestock: (itemId: string, quantity: number) => void
}

export function InventoryModal({ item, onClose, onRestock }: InventoryModalProps) {
  const [restockQuantity, setRestockQuantity] = useState<number>(item.minThreshold)

  const getStockStatus = (): "critical" | "low" | "normal" | "high" => {
    const percentage = (item.currentStock / item.maxCapacity) * 100
    if (item.currentStock <= item.minThreshold * 0.5) return "critical"
    if (item.currentStock <= item.minThreshold) return "low"
    if (percentage > 80) return "high"
    return "normal"
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

  const status = getStockStatus()
  const percentage = Math.round((item.currentStock / item.maxCapacity) * 100)
  const isExpiringSoon = item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

  const handleRestock = () => {
    onRestock(item.id, restockQuantity)
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span>Inventory Details</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{item.name}</span>
                <Badge className={getStatusBadgeColor(status)}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Item ID</div>
                  <div className="text-base text-gray-900">{item.id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Category</div>
                  <div className="text-base text-gray-900">{item.category}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Location</div>
                  <div className="text-base text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {item.location}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Supplier</div>
                  <div className="text-base text-gray-900 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    {item.supplier}
                  </div>
                </div>
              </div>

              {/* Expiry Warning */}
              {isExpiringSoon && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-orange-800">Expiring Soon</div>
                      <div className="text-sm text-orange-700">
                        This item expires on {item.expiryDate}. Consider using or replacing soon.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Information */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{item.currentStock}</div>
                  <div className="text-sm text-gray-500">Current Stock</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{item.minThreshold}</div>
                  <div className="text-sm text-gray-500">Min Threshold</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{item.maxCapacity}</div>
                  <div className="text-sm text-gray-500">Max Capacity</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Stock Level</span>
                  <span className="text-sm text-gray-600">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      status === "critical"
                        ? "bg-red-500"
                        : status === "low"
                          ? "bg-yellow-500"
                          : status === "high"
                            ? "bg-blue-500"
                            : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <div className="text-sm font-medium text-gray-500">Last Restocked</div>
                  <div className="text-base text-gray-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {item.lastRestocked}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Unit Cost</div>
                  <div className="text-base text-gray-900 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />${item.cost.toFixed(2)} per {item.unit}
                  </div>
                </div>
                {item.expiryDate && (
                  <div className="col-span-2">
                    <div className="text-sm font-medium text-gray-500">Expiry Date</div>
                    <div className="text-base text-gray-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {item.expiryDate}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Restock Section */}
          <Card>
            <CardHeader>
              <CardTitle>Restock Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="restock-quantity">Quantity to Add</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRestockQuantity(Math.max(1, restockQuantity - 10))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="restock-quantity"
                    type="number"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="text-center"
                    min="1"
                    max={item.maxCapacity - item.currentStock}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setRestockQuantity(Math.min(item.maxCapacity - item.currentStock, restockQuantity + 10))
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">{item.unit}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium text-blue-800">Restock Summary</div>
                  <div className="text-blue-700 mt-1">
                    Current: {item.currentStock} {item.unit} → New Total: {item.currentStock + restockQuantity}{" "}
                    {item.unit}
                  </div>
                  <div className="text-blue-700">Estimated Cost: ${(item.cost * restockQuantity).toFixed(2)}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleRestock} className="flex-1">
                  <Package className="h-4 w-4 mr-2" />
                  Restock Item
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
