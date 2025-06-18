export interface Medication {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  description?: string;
  costPrice?: number;
  formulations?: string[];
  manufacturer?: string;
  expiryDate?: string;
  batchNumber?: string;
}

export interface GynecologicHistory {
  gravida?: string;
  para?: string;
  lastMenstrualPeriod?: string;
  contraceptiveHistory?: string;
  pregnancyHistory?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory: MedicalRecord[];
  gynecologicHistory?: GynecologicHistory;
  createdAt: string;
  updatedAt: string;
}

export interface VitalSigns {
  bloodPressure?: string;
  temperature?: string;
  pulse?: string;
  respiratoryRate?: string;
  weight?: string;
  height?: string;
  oxygenSaturation?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medications: DispensedMedication[];
  vitalSigns?: VitalSigns;
  notes?: string;
  followUpDate?: string;
  doctorName: string;
  analysisNotes?: string;
}

export interface DispensedMedication {
  medicationId: string;
  medicationName: string;
  quantity: number;
  dosage: string;
  frequency: string; // TDS, BD, OD, QID, etc.
  duration: number; // days
  instructions: string;
  price: number;
  totalCost: number;
}

export interface Transaction {
  id: string;
  type: 'patient' | 'general';
  patientId?: string;
  patientName?: string;
  items: DispensedMedication[];
  totalAmount: number;
  date: string;
  paymentMethod: 'cash' | 'mpesa' | 'card';
  status: 'completed' | 'pending' | 'confirmed';
  paymentConfirmed?: boolean;
  confirmedBy?: string;
  confirmedAt?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  category: 'general_medicine' | 'diagnostics' | 'procedures' | 'consultations';
  description: string;
}

export interface SaleItem {
  medicationId: string;
  medicationName: string;
  quantity: number;
  price: number;
  totalCost: number;
  frequency?: string;
  duration?: number;
}

export interface AppSettings {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string[];
  clinicEmail: string;
  currency: string;
  taxRate: number;
  lowStockThreshold: number;
  criticalStockThreshold: number;
  autoBackup: boolean;
  offlineMode: boolean;
}

export interface MedicalShortForm {
  code: string;
  description: string;
  timesPerDay: number;
}