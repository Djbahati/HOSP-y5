package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/handlers"
	_ "github.com/lib/pq"
)

type Staff struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	Role       string `json:"role"`
	Department string `json:"department"`
	Shift      string `json:"shift"`
	Status     string `json:"status"`
	Phone      string `json:"phone"`
	Email      string `json:"email"`
}

type Bed struct {
	ID       int    `json:"id"`
	Room     string `json:"room"`
	Floor    int    `json:"floor"`
	Status   string `json:"status"`
	Patient  string `json:"patient,omitempty"`
	Assigned string `json:"assigned,omitempty"`
}

type InventoryItem struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Category    string  `json:"category"`
	Stock       int     `json:"stock"`
	MinStock    int     `json:"min_stock"`
	Unit        string  `json:"unit"`
	Price       float64 `json:"price"`
	Supplier    string  `json:"supplier"`
	LastUpdated string  `json:"last_updated"`
}

type ApiResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message"`
}

var db *sql.DB

func main() {
	var err error
	
	// Database connection
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgresql://localhost/bahati_hospital?sslmode=disable"
	}

	db, err = sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Test database connection
	if err = db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	// Setup routes
	r := mux.NewRouter()
	
	// Health check
	r.HandleFunc("/health", healthCheck).Methods("GET")
	
	// Staff management endpoints
	r.HandleFunc("/api/staff", getStaff).Methods("GET")
	r.HandleFunc("/api/staff/{id}", updateStaffStatus).Methods("PUT")
	r.HandleFunc("/api/staff/schedule", getStaffSchedule).Methods("GET")
	
	// Bed management endpoints
	r.HandleFunc("/api/beds", getBeds).Methods("GET")
	r.HandleFunc("/api/beds/{id}", updateBedStatus).Methods("PUT")
	r.HandleFunc("/api/beds/floor/{floor}", getBedsByFloor).Methods("GET")
	
	// Inventory management endpoints
	r.HandleFunc("/api/inventory", getInventory).Methods("GET")
	r.HandleFunc("/api/inventory/{id}", updateInventoryStock).Methods("PUT")
	r.HandleFunc("/api/inventory/low-stock", getLowStockItems).Methods("GET")

	// CORS middleware
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"*"}),
	)(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	fmt.Printf("🚀 BAHATI Hospital Go Service starting on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler))
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	response := map[string]interface{}{
		"status":  "healthy",
		"service": "BAHATI Hospital Go Service",
		"version": "1.0.0",
		"time":    time.Now().Format(time.RFC3339),
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getStaff(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT id, name, role, department, shift, status, phone, email 
		FROM staff ORDER BY name
	`)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var staff []Staff
	for rows.Next() {
		var s Staff
		err := rows.Scan(&s.ID, &s.Name, &s.Role, &s.Department, &s.Shift, &s.Status, &s.Phone, &s.Email)
		if err != nil {
			continue
		}
		staff = append(staff, s)
	}

	response := ApiResponse{
		Success: true,
		Data:    staff,
		Message: "Staff retrieved successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func updateStaffStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	staffID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid staff ID", http.StatusBadRequest)
		return
	}

	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	status, ok := body["status"].(string)
	if !ok {
		status = "active"
	}

	_, err = db.Exec("UPDATE staff SET status = $1 WHERE id = $2", status, staffID)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	response := ApiResponse{
		Success: true,
		Message: "Staff status updated successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getStaffSchedule(w http.ResponseWriter, r *http.Request) {
	// Mock schedule data - in production, this would come from database
	schedule := map[string]interface{}{
		"today": map[string]interface{}{
			"morning": []map[string]string{
				{"name": "Dr. Sarah Johnson", "role": "Doctor", "department": "Emergency"},
				{"name": "Nurse Mary Wilson", "role": "Nurse", "department": "ICU"},
			},
			"afternoon": []map[string]string{
				{"name": "Dr. Michael Brown", "role": "Doctor", "department": "Surgery"},
				{"name": "Nurse John Davis", "role": "Nurse", "department": "Pediatrics"},
			},
			"night": []map[string]string{
				{"name": "Dr. Emily Chen", "role": "Doctor", "department": "Emergency"},
				{"name": "Nurse Lisa Garcia", "role": "Nurse", "department": "ICU"},
			},
		},
	}

	response := ApiResponse{
		Success: true,
		Data:    schedule,
		Message: "Schedule retrieved successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getBeds(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT id, room, floor, status, patient, assigned 
		FROM beds ORDER BY floor, room
	`)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var beds []Bed
	for rows.Next() {
		var b Bed
		var patient, assigned sql.NullString
		err := rows.Scan(&b.ID, &b.Room, &b.Floor, &b.Status, &patient, &assigned)
		if err != nil {
			continue
		}
		if patient.Valid {
			b.Patient = patient.String
		}
		if assigned.Valid {
			b.Assigned = assigned.String
		}
		beds = append(beds, b)
	}

	response := ApiResponse{
		Success: true,
		Data:    beds,
		Message: "Beds retrieved successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func updateBedStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	bedID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid bed ID", http.StatusBadRequest)
		return
	}

	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	status, ok := body["status"].(string)
	if !ok {
		status = "available"
	}

	_, err = db.Exec("UPDATE beds SET status = $1 WHERE id = $2", status, bedID)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	response := ApiResponse{
		Success: true,
		Message: "Bed status updated successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getBedsByFloor(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	floor, err := strconv.Atoi(vars["floor"])
	if err != nil {
		http.Error(w, "Invalid floor number", http.StatusBadRequest)
		return
	}

	rows, err := db.Query(`
		SELECT id, room, floor, status, patient, assigned 
		FROM beds WHERE floor = $1 ORDER BY room
	`, floor)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var beds []Bed
	for rows.Next() {
		var b Bed
		var patient, assigned sql.NullString
		err := rows.Scan(&b.ID, &b.Room, &b.Floor, &b.Status, &patient, &assigned)
		if err != nil {
			continue
		}
		if patient.Valid {
			b.Patient = patient.String
		}
		if assigned.Valid {
			b.Assigned = assigned.String
		}
		beds = append(beds, b)
	}

	response := ApiResponse{
		Success: true,
		Data:    beds,
		Message: fmt.Sprintf("Beds for floor %d retrieved successfully", floor),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getInventory(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT id, name, category, stock, min_stock, unit, price, supplier, last_updated 
		FROM inventory ORDER BY name
	`)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var items []InventoryItem
	for rows.Next() {
		var item InventoryItem
		err := rows.Scan(&item.ID, &item.Name, &item.Category, &item.Stock, &item.MinStock, 
			&item.Unit, &item.Price, &item.Supplier, &item.LastUpdated)
		if err != nil {
			continue
		}
		items = append(items, item)
	}

	response := ApiResponse{
		Success: true,
		Data:    items,
		Message: "Inventory retrieved successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func updateInventoryStock(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	itemID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid item ID", http.StatusBadRequest)
		return
	}

	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	stock, ok := body["stock"].(float64)
	if !ok {
		http.Error(w, "Invalid stock value", http.StatusBadRequest)
		return
	}

	_, err = db.Exec("UPDATE inventory SET stock = $1, last_updated = NOW() WHERE id = $2", int(stock), itemID)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	response := ApiResponse{
		Success: true,
		Message: "Inventory stock updated successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getLowStockItems(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT id, name, category, stock, min_stock, unit, price, supplier, last_updated 
		FROM inventory WHERE stock <= min_stock ORDER BY (stock::float / min_stock::float)
	`)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var items []InventoryItem
	for rows.Next() {
		var item InventoryItem
		err := rows.Scan(&item.ID, &item.Name, &item.Category, &item.Stock, &item.MinStock, 
			&item.Unit, &item.Price, &item.Supplier, &item.LastUpdated)
		if err != nil {
			continue
		}
		items = append(items, item)
	}

	response := ApiResponse{
		Success: true,
		Data:    items,
		Message: "Low stock items retrieved successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
