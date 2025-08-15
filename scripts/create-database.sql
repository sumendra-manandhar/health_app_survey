-- Swarnabindu Prashan Database Schema
-- This script creates the necessary tables for the Swarnabindu Prashan program

-- Create database (if using PostgreSQL/MySQL)
-- CREATE DATABASE swarnabindu_prashan;
-- USE swarnabindu_prashan;

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    local_id VARCHAR(255) UNIQUE,
    serial_no VARCHAR(50) NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    birth_date DATE NOT NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    guardian_name VARCHAR(255),
    contact_number VARCHAR(20) NOT NULL,
    district VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    ward_no INTEGER NOT NULL,
    tole VARCHAR(100),
    caste VARCHAR(50),
    religion VARCHAR(50),
    vaccination_status VARCHAR(20) CHECK (vaccination_status IN ('complete', 'partial', 'none', 'unknown')),
    allergies TEXT,
    health_history TEXT,
    current_medication TEXT,
    health_conditions JSONB, -- Store array of current health conditions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced BOOLEAN DEFAULT FALSE
);

-- Screenings table
CREATE TABLE IF NOT EXISTS screenings (
    id SERIAL PRIMARY KEY,
    local_id VARCHAR(255) UNIQUE,
    registration_id INTEGER REFERENCES registrations(id),
    child_name VARCHAR(255) NOT NULL,
    serial_no VARCHAR(50) NOT NULL,
    screening_date DATE NOT NULL,
    screening_type VARCHAR(50) NOT NULL CHECK (screening_type IN ('first-time', 'follow-up', 'routine')),
    swarnabindu_date DATE NOT NULL,
    doses_given INTEGER NOT NULL CHECK (doses_given >= 1 AND doses_given <= 17),
    dose_amount VARCHAR(20) NOT NULL,
    health_issues TEXT,
    referral_status VARCHAR(50) NOT NULL CHECK (referral_status IN ('not-required', 'referred', 'pending', 'completed')),
    next_steps TEXT,
    remarks TEXT,
    batch_number VARCHAR(100),
    administered_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced BOOLEAN DEFAULT FALSE
);

-- Batches table for medicine tracking
CREATE TABLE IF NOT EXISTS medicine_batches (
    id SERIAL PRIMARY KEY,
    batch_number VARCHAR(100) UNIQUE NOT NULL,
    manufacture_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_ml INTEGER NOT NULL,
    remaining_ml INTEGER NOT NULL,
    manufacturer VARCHAR(255),
    quality_check_status VARCHAR(50) DEFAULT 'pending',
    storage_location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    registration_id INTEGER REFERENCES registrations(id),
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    total_doses INTEGER NOT NULL,
    start_date DATE NOT NULL,
    completion_date DATE NOT NULL,
    issued_date DATE NOT NULL,
    issued_by VARCHAR(255) NOT NULL,
    health_center VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evaluation forms table
CREATE TABLE IF NOT EXISTS evaluations (
    id SERIAL PRIMARY KEY,
    registration_id INTEGER REFERENCES registrations(id),
    evaluation_date DATE NOT NULL,
    evaluator_name VARCHAR(255) NOT NULL,
    physical_development JSONB, -- Height, weight, general appearance
    mental_development JSONB, -- Cognitive abilities, behavior
    immunity_status JSONB, -- Frequency of illness, recovery time
    digestive_health JSONB, -- Appetite, digestion issues
    overall_health_score INTEGER CHECK (overall_health_score >= 1 AND overall_health_score <= 10),
    recommendations TEXT,
    next_evaluation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pushya Nakshatra calendar table
CREATE TABLE IF NOT EXISTS pushya_calendar (
    id SERIAL PRIMARY KEY,
    pushya_date DATE NOT NULL,
    nepali_date VARCHAR(20),
    lunar_month VARCHAR(50),
    is_auspicious BOOLEAN DEFAULT TRUE,
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health workers table
CREATE TABLE IF NOT EXISTS health_workers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    qualification VARCHAR(255),
    license_number VARCHAR(100),
    contact_number VARCHAR(20),
    email VARCHAR(255),
    health_center VARCHAR(255),
    specialization VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_serial_no ON registrations(serial_no);
CREATE INDEX IF NOT EXISTS idx_registrations_child_name ON registrations(child_name);
CREATE INDEX IF NOT EXISTS idx_registrations_contact ON registrations(contact_number);
CREATE INDEX IF NOT EXISTS idx_registrations_birth_date ON registrations(birth_date);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);

CREATE INDEX IF NOT EXISTS idx_screenings_registration_id ON screenings(registration_id);
CREATE INDEX IF NOT EXISTS idx_screenings_screening_date ON screenings(screening_date);
CREATE INDEX IF NOT EXISTS idx_screenings_swarnabindu_date ON screenings(swarnabindu_date);
CREATE INDEX IF NOT EXISTS idx_screenings_batch_number ON screenings(batch_number);

CREATE INDEX IF NOT EXISTS idx_certificates_registration_id ON certificates(registration_id);
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_number ON certificates(certificate_number);

CREATE INDEX IF NOT EXISTS idx_evaluations_registration_id ON evaluations(registration_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_evaluation_date ON evaluations(evaluation_date);

CREATE INDEX IF NOT EXISTS idx_pushya_calendar_date ON pushya_calendar(pushya_date);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_screenings_updated_at BEFORE UPDATE ON screenings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicine_batches_updated_at BEFORE UPDATE ON medicine_batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_workers_updated_at BEFORE UPDATE ON health_workers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
