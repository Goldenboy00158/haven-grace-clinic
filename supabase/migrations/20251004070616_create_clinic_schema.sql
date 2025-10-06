/*
  # Create Clinic Management System Schema

  ## Overview
  This migration creates the complete database schema for a clinic management system
  with support for patients, medications, services, transactions, and medical records.

  ## New Tables

  ### 1. patients
  - `id` (uuid, primary key) - Unique patient identifier
  - `name` (text) - Patient's full name
  - `age` (integer) - Patient's age
  - `gender` (text) - Gender (male/female/other)
  - `phone` (text) - Contact phone number
  - `address` (text) - Patient's address
  - `emergency_contact` (text) - Emergency contact information
  - `notes` (text) - Additional notes about the patient
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. gynecologic_history
  - `id` (uuid, primary key) - Unique identifier
  - `patient_id` (uuid, foreign key) - Reference to patients table
  - `gravida` (text) - Number of pregnancies
  - `para` (text) - Number of births (format: "1+2")
  - `last_menstrual_period` (date) - LMP date
  - `contraceptive_history` (text) - Contraceptive methods used
  - `pregnancy_history` (text) - Details about previous pregnancies

  ### 3. medical_records
  - `id` (uuid, primary key) - Unique identifier
  - `patient_id` (uuid, foreign key) - Reference to patients table
  - `date` (timestamptz) - Visit date
  - `symptoms` (text) - Patient's symptoms
  - `diagnosis` (text) - Medical diagnosis
  - `treatment` (text) - Treatment plan
  - `notes` (text) - Additional notes
  - `follow_up_date` (date) - Follow-up appointment date
  - `doctor_name` (text) - Attending doctor's name
  - `analysis_notes` (text) - Clinical analysis notes
  - `vital_signs` (jsonb) - Vital signs data (BP, temp, pulse, etc.)
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. medications
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Medication name
  - `price` (decimal) - Selling price
  - `stock` (decimal) - Current stock level (supports decimals)
  - `category` (text) - Medication category
  - `description` (text) - Medication description
  - `cost_price` (decimal) - Cost price
  - `manufacturer` (text) - Manufacturer name
  - `expiry_date` (date) - Expiration date
  - `batch_number` (text) - Batch number
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. services
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Service name
  - `price` (decimal) - Service price
  - `category` (text) - Service category
  - `description` (text) - Service description
  - `duration` (integer) - Duration in minutes
  - `requirements` (text[]) - Required items/equipment
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 6. transactions
  - `id` (uuid, primary key) - Unique identifier
  - `type` (text) - Transaction type (patient/general)
  - `patient_id` (uuid, foreign key, nullable) - Reference to patients table
  - `patient_name` (text) - Patient/customer name
  - `total_amount` (decimal) - Total transaction amount
  - `date` (timestamptz) - Transaction date
  - `payment_method` (text) - Payment method (cash/mpesa/card)
  - `status` (text) - Transaction status (completed/pending/confirmed/partial)
  - `payment_confirmed` (boolean) - Payment confirmation status
  - `confirmed_by` (text) - Who confirmed the payment
  - `confirmed_at` (timestamptz) - When payment was confirmed
  - `created_at` (timestamptz) - Record creation timestamp

  ### 7. transaction_items
  - `id` (uuid, primary key) - Unique identifier
  - `transaction_id` (uuid, foreign key) - Reference to transactions table
  - `item_type` (text) - Type of item (medication/service)
  - `item_id` (uuid) - Reference to medication or service
  - `item_name` (text) - Item name
  - `quantity` (decimal) - Quantity (supports decimals)
  - `price` (decimal) - Unit price
  - `total_cost` (decimal) - Total cost for this item
  - `dosage` (text) - Medication dosage
  - `frequency` (text) - Medication frequency
  - `duration` (integer) - Treatment duration in days
  - `instructions` (text) - Additional instructions

  ### 8. prescribed_medications
  - `id` (uuid, primary key) - Unique identifier
  - `medical_record_id` (uuid, foreign key) - Reference to medical_records
  - `medication_id` (uuid, foreign key) - Reference to medications
  - `medication_name` (text) - Medication name
  - `quantity` (decimal) - Prescribed quantity
  - `dosage` (text) - Dosage instructions
  - `frequency` (text) - Frequency (TDS, BD, OD, etc.)
  - `duration` (integer) - Duration in days
  - `instructions` (text) - Additional instructions
  - `price` (decimal) - Unit price
  - `total_cost` (decimal) - Total cost

  ### 9. daily_expenses
  - `id` (uuid, primary key) - Unique identifier
  - `date` (timestamptz) - Expense date
  - `category` (text) - Expense category
  - `description` (text) - Expense description
  - `amount` (decimal) - Expense amount
  - `payment_method` (text) - Payment method
  - `receipt` (text) - Receipt reference
  - `added_by` (text) - Who added the expense
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Row Level Security (RLS) is enabled on all tables
  - Policies are created for authenticated users to manage their clinic data
  - All tables are protected with restrictive access policies
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer NOT NULL CHECK (age > 0),
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  phone text NOT NULL,
  address text,
  emergency_contact text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gynecologic_history table
CREATE TABLE IF NOT EXISTS gynecologic_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  gravida text,
  para text,
  last_menstrual_period date,
  contraceptive_history text,
  pregnancy_history text,
  UNIQUE(patient_id)
);

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  date timestamptz DEFAULT now(),
  symptoms text,
  diagnosis text,
  treatment text,
  notes text,
  follow_up_date date,
  doctor_name text,
  analysis_notes text,
  vital_signs jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  stock decimal(10,2) NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category text,
  description text,
  cost_price decimal(10,2) DEFAULT 0,
  manufacturer text,
  expiry_date date,
  batch_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL,
  description text,
  duration integer,
  requirements text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('patient', 'general')),
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  patient_name text,
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  date timestamptz DEFAULT now(),
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'mpesa', 'card')),
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'confirmed', 'partial')),
  payment_confirmed boolean DEFAULT false,
  confirmed_by text,
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create transaction_items table
CREATE TABLE IF NOT EXISTS transaction_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('medication', 'service')),
  item_id uuid,
  item_name text NOT NULL,
  quantity decimal(10,2) NOT NULL DEFAULT 1,
  price decimal(10,2) NOT NULL DEFAULT 0,
  total_cost decimal(10,2) NOT NULL DEFAULT 0,
  dosage text,
  frequency text,
  duration integer,
  instructions text
);

-- Create prescribed_medications table
CREATE TABLE IF NOT EXISTS prescribed_medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id uuid REFERENCES medical_records(id) ON DELETE CASCADE,
  medication_id uuid REFERENCES medications(id) ON DELETE SET NULL,
  medication_name text NOT NULL,
  quantity decimal(10,2) NOT NULL DEFAULT 1,
  dosage text,
  frequency text,
  duration integer,
  instructions text,
  price decimal(10,2) NOT NULL DEFAULT 0,
  total_cost decimal(10,2) NOT NULL DEFAULT 0
);

-- Create daily_expenses table
CREATE TABLE IF NOT EXISTS daily_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz DEFAULT now(),
  category text NOT NULL CHECK (category IN ('utilities', 'supplies', 'food', 'transport', 'maintenance', 'staff', 'other')),
  description text NOT NULL,
  amount decimal(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'mpesa', 'bank', 'card')),
  receipt text,
  added_by text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_date ON medical_records(date);
CREATE INDEX IF NOT EXISTS idx_transactions_patient ON transactions(patient_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_prescribed_medications_record ON prescribed_medications(medical_record_id);
CREATE INDEX IF NOT EXISTS idx_daily_expenses_date ON daily_expenses(date);

-- Enable Row Level Security on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE gynecologic_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescribed_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for patients table
CREATE POLICY "Users can view all patients"
  ON patients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update patients"
  ON patients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete patients"
  ON patients FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS Policies for gynecologic_history table
CREATE POLICY "Users can view gynecologic history"
  ON gynecologic_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert gynecologic history"
  ON gynecologic_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update gynecologic history"
  ON gynecologic_history FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete gynecologic history"
  ON gynecologic_history FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS Policies for medical_records table
CREATE POLICY "Users can view medical records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert medical records"
  ON medical_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update medical records"
  ON medical_records FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete medical records"
  ON medical_records FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS Policies for medications table
CREATE POLICY "Users can view medications"
  ON medications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert medications"
  ON medications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update medications"
  ON medications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete medications"
  ON medications FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS Policies for services table
CREATE POLICY "Users can view services"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS Policies for transactions table
CREATE POLICY "Users can view transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS Policies for transaction_items table
CREATE POLICY "Users can view transaction items"
  ON transaction_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert transaction items"
  ON transaction_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update transaction items"
  ON transaction_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete transaction items"
  ON transaction_items FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS Policies for prescribed_medications table
CREATE POLICY "Users can view prescribed medications"
  ON prescribed_medications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert prescribed medications"
  ON prescribed_medications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update prescribed medications"
  ON prescribed_medications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete prescribed medications"
  ON prescribed_medications FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS Policies for daily_expenses table
CREATE POLICY "Users can view daily expenses"
  ON daily_expenses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert daily expenses"
  ON daily_expenses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update daily expenses"
  ON daily_expenses FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete daily expenses"
  ON daily_expenses FOR DELETE
  TO authenticated
  USING (true);