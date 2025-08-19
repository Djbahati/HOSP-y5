use actix_web::{web, App, HttpServer, Result, HttpResponse, middleware::Logger};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Row};
use std::env;

#[derive(Serialize, Deserialize)]
struct Patient {
    id: i32,
    name: String,
    age: i32,
    condition: String,
    status: String,
    room: String,
}

#[derive(Serialize, Deserialize)]
struct Treatment {
    id: i32,
    patient_id: i32,
    treatment_type: String,
    medication: String,
    dosage: String,
    frequency: String,
    start_date: String,
    status: String,
}

#[derive(Serialize, Deserialize)]
struct ApiResponse<T> {
    success: bool,
    data: Option<T>,
    message: String,
}

// Get all patients
async fn get_patients(pool: web::Data<PgPool>) -> Result<HttpResponse> {
    let rows = sqlx::query("SELECT id, name, age, condition, status, room FROM patients ORDER BY id")
        .fetch_all(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;

    let patients: Vec<Patient> = rows
        .iter()
        .map(|row| Patient {
            id: row.get("id"),
            name: row.get("name"),
            age: row.get("age"),
            condition: row.get("condition"),
            status: row.get("status"),
            room: row.get("room"),
        })
        .collect();

    Ok(HttpResponse::Ok().json(ApiResponse {
        success: true,
        data: Some(patients),
        message: "Patients retrieved successfully".to_string(),
    }))
}

// Get treatments for a patient
async fn get_treatments(
    pool: web::Data<PgPool>,
    path: web::Path<i32>,
) -> Result<HttpResponse> {
    let patient_id = path.into_inner();
    
    let rows = sqlx::query(
        "SELECT id, patient_id, treatment_type, medication, dosage, frequency, start_date, status 
         FROM treatments WHERE patient_id = $1 ORDER BY start_date DESC"
    )
    .bind(patient_id)
    .fetch_all(pool.get_ref())
    .await
    .map_err(|e| {
        eprintln!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    let treatments: Vec<Treatment> = rows
        .iter()
        .map(|row| Treatment {
            id: row.get("id"),
            patient_id: row.get("patient_id"),
            treatment_type: row.get("treatment_type"),
            medication: row.get("medication"),
            dosage: row.get("dosage"),
            frequency: row.get("frequency"),
            start_date: row.get("start_date"),
            status: row.get("status"),
        })
        .collect();

    Ok(HttpResponse::Ok().json(ApiResponse {
        success: true,
        data: Some(treatments),
        message: "Treatments retrieved successfully".to_string(),
    }))
}

// Update treatment status
async fn update_treatment_status(
    pool: web::Data<PgPool>,
    path: web::Path<i32>,
    body: web::Json<serde_json::Value>,
) -> Result<HttpResponse> {
    let treatment_id = path.into_inner();
    let status = body.get("status").and_then(|s| s.as_str()).unwrap_or("active");

    sqlx::query("UPDATE treatments SET status = $1 WHERE id = $2")
        .bind(status)
        .bind(treatment_id)
        .execute(pool.get_ref())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            actix_web::error::ErrorInternalServerError("Database error")
        })?;

    Ok(HttpResponse::Ok().json(ApiResponse::<()> {
        success: true,
        data: None,
        message: "Treatment status updated successfully".to_string(),
    }))
}

// Health check endpoint
async fn health_check() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "BAHATI Hospital Rust Service",
        "version": "1.0.0"
    })))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgresql://localhost/bahati_hospital".to_string());

    let pool = PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to database");

    println!("🚀 BAHATI Hospital Rust Service starting on port 8080");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(Logger::default())
            .wrap(
                actix_cors::Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            .route("/health", web::get().to(health_check))
            .route("/api/patients", web::get().to(get_patients))
            .route("/api/patients/{id}/treatments", web::get().to(get_treatments))
            .route("/api/treatments/{id}/status", web::put().to(update_treatment_status))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
