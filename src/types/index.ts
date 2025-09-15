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
  para?: string; // Now supports format like "1+2" for live births + miscarriages
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
  // SMART format fields
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  pastMedicalHistory?: string;
  pastSurgicalHistory?: string;
  familyHistory?: string;
  socialHistory?: string;
  reviewOfSystems?: string;
  // Legacy fields (keeping for compatibility)
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
  category: 'general_medicine' | 'diagnostics' | 'procedures' | 'consultations' | 'family_planning';
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
  originalPrice?: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  id?: string;
  name?: string;
  category?: string;
  description?: string;
  type?: 'medication' | 'service';
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  totalCost: number;
  description: string;
  originalPrice?: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
}

export interface ClinicalService {
  id: string;
  name: string;
  price: number;
  category: 'general_medicine' | 'diagnostics' | 'procedures' | 'consultations' | 'family_planning';
  description: string;
  duration?: number;
  requirements?: string[];
  severity?: 'mild' | 'moderate' | 'severe';
}

export interface ServicesManagementProps {
  isReviewMode?: boolean;
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

// New Expense Types
export interface DailyExpense {
  id: string;
  date: string;
  category: 'utilities' | 'supplies' | 'food' | 'transport' | 'maintenance' | 'staff' | 'other';
  description: string;
  amount: number;
  paymentMethod: 'cash' | 'mpesa' | 'bank' | 'card';
  receipt?: string;
  addedBy: string;
  addedAt: string;
  notes?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  budgetLimit?: number;
}

// Analytics Types
export interface DiagnosisAnalytics {
  diagnosis: string;
  count: number;
  percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastMonth: number;
  thisMonth: number;
}

export interface InventoryAnalytics {
  medicationId: string;
  medicationName: string;
  totalSold: number;
  revenue: number;
  profitMargin: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  category: string;
  stockTurnover: number;
}

export interface AnalyticsData {
  commonDiagnoses: DiagnosisAnalytics[];
  topSellingMedications: InventoryAnalytics[];
  revenueAnalytics: {
    daily: number;
    weekly: number;
    monthly: number;
    trends: { date: string; revenue: number; expenses: number }[];
  };
  patientAnalytics: {
    totalPatients: number;
    newPatientsThisMonth: number;
    averageAge: number;
    genderDistribution: { male: number; female: number; other: number };
  };
}