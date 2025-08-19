// API configuration for BAHATI Hospital backend services

const RUST_API_URL = process.env.NEXT_PUBLIC_RUST_API_URL || "http://localhost:8080"
const GO_API_URL = process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8081"

// Rust service API calls (handles patients and treatments)
export const rustApi = {
  async getPatients() {
    const response = await fetch(`${RUST_API_URL}/api/patients`)
    return response.json()
  },

  async getPatientTreatments(patientId: number) {
    const response = await fetch(`${RUST_API_URL}/api/patients/${patientId}/treatments`)
    return response.json()
  },

  async updateTreatmentStatus(treatmentId: number, status: string) {
    const response = await fetch(`${RUST_API_URL}/api/treatments/${treatmentId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    return response.json()
  },

  async healthCheck() {
    const response = await fetch(`${RUST_API_URL}/health`)
    return response.json()
  },
}

// Go service API calls (handles staff, beds, and inventory)
export const goApi = {
  async getStaff() {
    const response = await fetch(`${GO_API_URL}/api/staff`)
    return response.json()
  },

  async updateStaffStatus(staffId: number, status: string) {
    const response = await fetch(`${GO_API_URL}/api/staff/${staffId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    return response.json()
  },

  async getStaffSchedule() {
    const response = await fetch(`${GO_API_URL}/api/staff/schedule`)
    return response.json()
  },

  async getBeds() {
    const response = await fetch(`${GO_API_URL}/api/beds`)
    return response.json()
  },

  async updateBedStatus(bedId: number, status: string) {
    const response = await fetch(`${GO_API_URL}/api/beds/${bedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    return response.json()
  },

  async getBedsByFloor(floor: number) {
    const response = await fetch(`${GO_API_URL}/api/beds/floor/${floor}`)
    return response.json()
  },

  async getInventory() {
    const response = await fetch(`${GO_API_URL}/api/inventory`)
    return response.json()
  },

  async updateInventoryStock(itemId: number, stock: number) {
    const response = await fetch(`${GO_API_URL}/api/inventory/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    })
    return response.json()
  },

  async getLowStockItems() {
    const response = await fetch(`${GO_API_URL}/api/inventory/low-stock`)
    return response.json()
  },

  async healthCheck() {
    const response = await fetch(`${GO_API_URL}/health`)
    return response.json()
  },
}

// Combined health check for both services
export const checkBackendHealth = async () => {
  try {
    const [rustHealth, goHealth] = await Promise.all([rustApi.healthCheck(), goApi.healthCheck()])

    return {
      rust: rustHealth,
      go: goHealth,
      overall: rustHealth.status === "healthy" && goHealth.status === "healthy",
    }
  } catch (error) {
    console.error("Backend health check failed:", error)
    return {
      rust: { status: "unhealthy" },
      go: { status: "unhealthy" },
      overall: false,
    }
  }
}
