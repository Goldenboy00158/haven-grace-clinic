import React, { useState } from 'react';
import { Search, Plus, User, Phone, Calendar, FileText, Edit, Eye, RotateCcw, Calculator, Heart, Stethoscope, ShoppingCart, AlertCircle, CheckCircle2, Clock, Activity } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, MedicalRecord, DispensedMedication, VitalSigns, Transaction } from '../types';
import { getTabletCapsuleMedications } from '../data/medications';
import { medicalShortForms, calculateTotalQuantity } from '../data/medicalShortForms';
import EnhancedPatientView from './EnhancedPatientView';
import PatientRevisit from './PatientRevisit';
import TCACalculator from './TCACalculator';
import EnhancedPatientServicesModal from './EnhancedPatientServicesModal';

interface PatientManagementProps {
  isReviewMode?: boolean;
}

interface ComprehensiveHistory {
  // Chief Complaint & History of Present Illness
  chiefComplaint: string;
  historyOfPresentIllness: string;
  onsetDuration: string;
  associatedSymptoms: string[];
  
  // Past Medical History
  pastMedicalHistory: string;
  currentMedications: string;
  allergies: string;
  surgicalHistory: string;
  
  // Social History
  smokingStatus: 'never' | 'current' | 'former';
  alcoholUse: 'none' | 'occasional' | 'moderate' | 'heavy';
  occupation: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  
  // Family History
  familyHistory: string;
  
  // Review of Systems
  reviewOfSystems: {
    constitutional: string[];
    cardiovascular: string[];
    respiratory: string[];
    gastrointestinal: string[];
    genitourinary: string[];
    neurological: string[];
    musculoskeletal: string[];
    dermatological: string[];
    psychiatric: string[];
  };
  
  // Physical Examination
  generalAppearance: string;
  systemicExamination: {
    cardiovascular: string;
    respiratory: string;
    abdominal: string;
    neurological: string;
    musculoskeletal: string;
    skin: string;
  };
}

export default function PatientManagement({ isReviewMode = false }: PatientManagementProps) {
  const [patients, setPatients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [revisitPatient, setRevisitPatient] = useState<Patient | null>(null);
  const [showTCACalculator, setShowTCACalculator] = useState<Patient | null>(null);
  const [showServicesModal, setShowServicesModal] = useState<Patient | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Get only tablet/capsule medications for prescription
  const availableMedications = getTabletCapsuleMedications();

  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    phone: '',
    address: '',
    emergencyContact: '',
    // Basic medical record
    symptoms: '',
    diagnosis: '',
    treatment: '',
    medications: [] as DispensedMedication[],
    vitalSigns: {} as VitalSigns,
    notes: '',
    followUpDate: '',
    doctorName: '',
    analysisNotes: '',
    // Gynecologic and Obstetric History (for females)
    gravida: '',
    para: '',
    lastMenstrualPeriod: '',
    contraceptiveHistory: '',
    pregnancyHistory: '',
    // Comprehensive history
    comprehensiveHistory: {
      chiefComplaint: '',
      historyOfPresentIllness: '',
      onsetDuration: '',
      associatedSymptoms: [],
      pastMedicalHistory: '',
      currentMedications: '',
      allergies: '',
      surgicalHistory: '',
      smokingStatus: 'never' as const,
      alcoholUse: 'none' as const,
      occupation: '',
      maritalStatus: 'single' as const,
      familyHistory: '',
      reviewOfSystems: {
        constitutional: [],
        cardiovascular: [],
        respiratory: [],
        gastrointestinal: [],
        genitourinary: [],
        neurological: [],
        musculoskeletal: [],
        dermatological: [],
        psychiatric: []
      },
      generalAppearance: '',
      systemicExamination: {
        cardiovascular: '',
        respiratory: '',
        abdominal: '',
        neurological: '',
        musculoskeletal: '',
        skin: ''
      }
    } as ComprehensiveHistory
  });

  const [selectedMedication, setSelectedMedication] = useState('');
  const [medicationDosage, setMedicationDosage] = useState('');
  const [medicationFrequency, setMedicationFrequency] = useState('');
  const [medicationDuration, setMedicationDuration] = useState(7);
  const [medicationInstructions, setMedicationInstructions] = useState('');

  // Common symptoms for quick selection
  const commonSymptoms = [
    'Fever', 'Headache', 'Cough', 'Shortness of breath', 'Chest pain', 'Abdominal pain',
    'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Fatigue', 'Dizziness',
    'Joint pain', 'Back pain', 'Rash', 'Weight loss', 'Weight gain', 'Sleep problems'
  ];

  // Review of systems categories
  const reviewOfSystemsCategories = {
    constitutional: ['Fever', 'Chills', 'Night sweats', 'Weight loss', 'Weight gain', 'Fatigue', 'Malaise'],
    cardiovascular: ['Chest pain', 'Palpitations', 'Shortness of breath', 'Orthopnea', 'Leg swelling', 'Syncope'],
    respiratory: ['Cough', 'Shortness of breath', 'Wheezing', 'Hemoptysis', 'Chest pain'],
    gastrointestinal: ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain', 'Heartburn', 'Blood in stool'],
    genitourinary: ['Dysuria', 'Frequency', 'Urgency', 'Hematuria', 'Incontinence', 'Discharge'],
    neurological: ['Headache', 'Dizziness', 'Seizures', 'Weakness', 'Numbness', 'Memory problems'],
    musculoskeletal: ['Joint pain', 'Muscle pain', 'Back pain', 'Stiffness', 'Swelling'],
    dermatological: ['Rash', 'Itching', 'Changes in moles', 'Hair loss', 'Nail changes'],
    psychiatric: ['Depression', 'Anxiety', 'Sleep problems', 'Mood changes', 'Concentration problems']
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const addSymptomToHistory = (symptom: string, category: keyof typeof reviewOfSystemsCategories) => {
    setNewPatient(prev => ({
      ...prev,
      comprehensiveHistory: {
        ...prev.comprehensiveHistory,
        reviewOfSystems: {
          ...prev.comprehensiveHistory.reviewOfSystems,
          [category]: prev.comprehensiveHistory.reviewOfSystems[category].includes(symptom)
            ? prev.comprehensiveHistory.reviewOfSystems[category].filter(s => s !== symptom)
            : [...prev.comprehensiveHistory.reviewOfSystems[category], symptom]
        }
      }
    }));
  };

  const addAssociatedSymptom = (symptom: string) => {
    setNewPatient(prev => ({
      ...prev,
      comprehensiveHistory: {
        ...prev.comprehensiveHistory,
        associatedSymptoms: prev.comprehensiveHistory.associatedSymptoms.includes(symptom)
          ? prev.comprehensiveHistory.associatedSymptoms.filter(s => s !== symptom)
          : [...prev.comprehensiveHistory.associatedSymptoms, symptom]
      }
    }));
  };

  const addMedicationToRecord = () => {
    if (!selectedMedication || !medicationFrequency) return;

    const medication = availableMedications.find(med => med.id === selectedMedication);
    if (!medication) return;

    const calculatedQuantity = calculateTotalQuantity(medicationFrequency, medicationDuration);

    const dispensedMed: DispensedMedication = {
      medicationId: medication.id,
      medicationName: medication.name,
      quantity: calculatedQuantity,
      dosage: medicationDosage,
      frequency: medicationFrequency,
      duration: medicationDuration,
      instructions: medicationInstructions,
      price: medication.price,
      totalCost: medication.price * calculatedQuantity
    };

    setNewPatient(prev => ({
      ...prev,
      medications: [...prev.medications, dispensedMed]
    }));

    setSelectedMedication('');
    setMedicationDosage('');
    setMedicationFrequency('');
    setMedicationDuration(7);
    setMedicationInstructions('');
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patientId = Date.now().toString();
    
    // Create comprehensive first medical record
    const firstRecord: MedicalRecord = {
      id: (Date.now() + 1).toString(),
      patientId: patientId,
      date: new Date().toISOString(),
      symptoms: newPatient.comprehensiveHistory.chiefComplaint || newPatient.symptoms,
      diagnosis: newPatient.diagnosis,
      treatment: newPatient.treatment,
      medications: newPatient.medications,
      vitalSigns: newPatient.vitalSigns,
      notes: newPatient.notes,
      followUpDate: newPatient.followUpDate,
      doctorName: newPatient.doctorName,
      analysisNotes: newPatient.analysisNotes,
      // Store comprehensive history in the first record
      comprehensiveHistory: newPatient.comprehensiveHistory
    };

    const patient: Patient = {
      id: patientId,
      name: newPatient.name,
      age: parseInt(newPatient.age),
      gender: newPatient.gender,
      phone: newPatient.phone,
      address: newPatient.address,
      emergencyContact: newPatient.emergencyContact,
      medicalHistory: [firstRecord],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Add gynecologic history for females
      ...(newPatient.gender === 'female' && {
        gynecologicHistory: {
          gravida: newPatient.gravida,
          para: newPatient.para,
          lastMenstrualPeriod: newPatient.lastMenstrualPeriod,
          contraceptiveHistory: newPatient.contraceptiveHistory,
          pregnancyHistory: newPatient.pregnancyHistory
        }
      })
    };

    setPatients(prev => [patient, ...prev]);
    
    // Reset form
    setNewPatient({
      name: '',
      age: '',
      gender: 'male',
      phone: '',
      address: '',
      emergencyContact: '',
      symptoms: '',
      diagnosis: '',
      treatment: '',
      medications: [],
      vitalSigns: {},
      notes: '',
      followUpDate: '',
      doctorName: '',
      analysisNotes: '',
      gravida: '',
      para: '',
      lastMenstrualPeriod: '',
      contraceptiveHistory: '',
      pregnancyHistory: '',
      comprehensiveHistory: {
        chiefComplaint: '',
        historyOfPresentIllness: '',
        onsetDuration: '',
        associatedSymptoms: [],
        pastMedicalHistory: '',
        currentMedications: '',
        allergies: '',
        surgicalHistory: '',
        smokingStatus: 'never',
        alcoholUse: 'none',
        occupation: '',
        maritalStatus: 'single',
        familyHistory: '',
        reviewOfSystems: {
          constitutional: [],
          cardiovascular: [],
          respiratory: [],
          gastrointestinal: [],
          genitourinary: [],
          neurological: [],
          musculoskeletal: [],
          dermatological: [],
          psychiatric: []
        },
        generalAppearance: '',
        systemicExamination: {
          cardiovascular: '',
          respiratory: '',
          abdominal: '',
          neurological: '',
          musculoskeletal: '',
          skin: ''
        }
      }
    });
    setCurrentStep(1);
    setShowAddPatient(false);
  };

  const handleAddRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newMedicalRecord: MedicalRecord = {
      id: Date.now().toString(),
      ...record
    };

    setPatients(prev => prev.map(patient => 
      patient.id === record.patientId 
        ? { 
            ...patient, 
            medicalHistory: [newMedicalRecord, ...patient.medicalHistory],
            updatedAt: new Date().toISOString()
          }
        : patient
    ));
  };

  const handleSellToPatient = (patientId: string, items: DispensedMedication[]) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient || items.length === 0) return;

    const totalAmount = items.reduce((sum, item) => sum + item.totalCost, 0);
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'patient',
      patientId: patient.id,
      patientName: patient.name,
      items: items,
      totalAmount,
      date: new Date().toISOString(),
      paymentMethod: 'cash',
      status: 'completed'
    };

    setTransactions(prev => [transaction, ...prev]);
  };

  const handleTCASchedule = (tcaDate: string, method: string, nextDue: string) => {
    if (!showTCACalculator) return;
    
    const tcaRecord: MedicalRecord = {
      id: Date.now().toString(),
      patientId: showTCACalculator.id,
      date: new Date().toISOString(),
      symptoms: 'Family Planning Follow-up',
      diagnosis: `${method} - TCA Scheduled`,
      treatment: 'Continue current family planning method',
      medications: [],
      vitalSigns: {},
      notes: `TCA scheduled for ${new Date(tcaDate).toLocaleDateString()}. Next service due: ${new Date(nextDue).toLocaleDateString()}`,
      followUpDate: tcaDate,
      doctorName: 'System Generated',
      analysisNotes: `Automated TCA calculation for ${method}. Patient should return 3 days before due date for appointment scheduling.`
    };

    handleAddRecord(tcaRecord);
    setShowTCACalculator(null);
  };

  const handleChargePatientForServices = (services: any[], totalAmount: number, paymentMethod: string, transactionId?: string) => {
    alert(`Services charged successfully! Total: KES ${totalAmount.toLocaleString()} via ${paymentMethod}${transactionId ? ` (ID: ${transactionId})` : ''}`);
    setShowServicesModal(null);
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (step === currentStep) return <Clock className="h-5 w-5 text-blue-600" />;
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>;
  };

  const steps = [
    { number: 1, title: 'Patient Demographics', icon: User },
    { number: 2, title: 'Chief Complaint & HPI', icon: FileText },
    { number: 3, title: 'Medical History', icon: Heart },
    { number: 4, title: 'Review of Systems', icon: Activity },
    { number: 5, title: 'Physical Exam & Vitals', icon: Stethoscope },
    { number: 6, title: 'Assessment & Plan', icon: Edit }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
          <p className="text-gray-600">Comprehensive patient records with structured first visit documentation ({availableMedications.length} medications available)</p>
        </div>
        {!isReviewMode && (
          <button
            onClick={() => setShowAddPatient(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Patient</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Patients ({filteredPatients.length})</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{patient.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Age: {patient.age}</span>
                      <span>Gender: {patient.gender}</span>
                      <span className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {patient.phone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>{patient.medicalHistory.length} medical records</span>
                      <span>Last visit: {patient.medicalHistory.length > 0 
                        ? new Date(patient.medicalHistory[0].date).toLocaleDateString()
                        : 'Never'
                      }</span>
                      {patient.gynecologicHistory && (
                        <span>G{patient.gynecologicHistory.gravida}P{patient.gynecologicHistory.para}</span>
                      )}
                      {patient.medicalHistory[0]?.comprehensiveHistory && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Complete History
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {patient.gender === 'female' && !isReviewMode && (
                    <button
                      onClick={() => setShowTCACalculator(patient)}
                      className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <Calculator className="h-4 w-4" />
                      <span>TCA</span>
                    </button>
                  )}
                  {!isReviewMode && (
                    <button
                      onClick={() => setShowServicesModal(patient)}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <Stethoscope className="h-4 w-4" />
                      <span>Services</span>
                    </button>
                  )}
                  {!isReviewMode && (
                    <button
                      onClick={() => setRevisitPatient(patient)}
                      className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Revisit</span>
                    </button>
                  )}
                  <button
                    onClick={() => setViewingPatient(patient)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPatients.length === 0 && (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No patients found.</p>
          </div>
        )}
      </div>

      {/* Enhanced Add Patient Modal with Step-by-Step Process */}
      {showAddPatient && !isReviewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            {/* Progress Steps */}
            <div className="bg-gray-50 p-6 border-b">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center space-x-2 ${step.number === currentStep ? 'text-blue-600' : step.number < currentStep ? 'text-green-600' : 'text-gray-400'}`}>
                      {getStepIcon(step.number)}
                      <span className="text-sm font-medium hidden md:block">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 ${step.number < currentStep ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddPatient} className="p-6">
              {/* Step 1: Patient Demographics */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Patient Demographics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newPatient.name}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                      <input
                        type="number"
                        required
                        value={newPatient.age}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, age: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                      <select
                        value={newPatient.gender}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={newPatient.phone}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                      <input
                        type="text"
                        value={newPatient.comprehensiveHistory.occupation}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          comprehensiveHistory: { ...prev.comprehensiveHistory, occupation: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                      <select
                        value={newPatient.comprehensiveHistory.maritalStatus}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          comprehensiveHistory: { ...prev.comprehensiveHistory, maritalStatus: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={newPatient.address}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                      <input
                        type="tel"
                        value={newPatient.emergencyContact}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, emergencyContact: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Gynecologic History for Females */}
                  {newPatient.gender === 'female' && (
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-4">Gynecologic & Obstetric History</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gravida (G)</label>
                          <input
                            type="number"
                            min="0"
                            value={newPatient.gravida}
                            onChange={(e) => setNewPatient(prev => ({ ...prev, gravida: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Para (P)</label>
                          <input
                            type="number"
                            min="0"
                            value={newPatient.para}
                            onChange={(e) => setNewPatient(prev => ({ ...prev, para: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Menstrual Period</label>
                          <input
                            type="date"
                            value={newPatient.lastMenstrualPeriod}
                            onChange={(e) => setNewPatient(prev => ({ ...prev, lastMenstrualPeriod: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Contraceptive History</label>
                          <input
                            type="text"
                            value={newPatient.contraceptiveHistory}
                            onChange={(e) => setNewPatient(prev => ({ ...prev, contraceptiveHistory: e.target.value }))}
                            placeholder="e.g., OCP, IUD, Condoms"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Chief Complaint & HPI */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Chief Complaint & History of Present Illness</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint *</label>
                    <textarea
                      required
                      value={newPatient.comprehensiveHistory.chiefComplaint}
                      onChange={(e) => setNewPatient(prev => ({
                        ...prev,
                        comprehensiveHistory: { ...prev.comprehensiveHistory, chiefComplaint: e.target.value }
                      }))}
                      placeholder="Patient's main concern in their own words..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">History of Present Illness</label>
                    <textarea
                      value={newPatient.comprehensiveHistory.historyOfPresentIllness}
                      onChange={(e) => setNewPatient(prev => ({
                        ...prev,
                        comprehensiveHistory: { ...prev.comprehensiveHistory, historyOfPresentIllness: e.target.value }
                      }))}
                      placeholder="Detailed description of the current illness..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Onset & Duration</label>
                    <input
                      type="text"
                      value={newPatient.comprehensiveHistory.onsetDuration}
                      onChange={(e) => setNewPatient(prev => ({
                        ...prev,
                        comprehensiveHistory: { ...prev.comprehensiveHistory, onsetDuration: e.target.value }
                      }))}
                      placeholder="e.g., 3 days ago, gradual onset over 2 weeks"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Associated Symptoms</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {commonSymptoms.map(symptom => (
                        <button
                          key={symptom}
                          type="button"
                          onClick={() => addAssociatedSymptom(symptom)}
                          className={`p-2 text-sm rounded-lg border transition-colors ${
                            newPatient.comprehensiveHistory.associatedSymptoms.includes(symptom)
                              ? 'bg-blue-100 border-blue-300 text-blue-800'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {symptom}
                        </button>
                      ))}
                    </div>
                    {newPatient.comprehensiveHistory.associatedSymptoms.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        Selected: {newPatient.comprehensiveHistory.associatedSymptoms.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Medical History */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Medical History</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Past Medical History</label>
                      <textarea
                        value={newPatient.comprehensiveHistory.pastMedicalHistory}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          comprehensiveHistory: { ...prev.comprehensiveHistory, pastMedicalHistory: e.target.value }
                        }))}
                        placeholder="Previous illnesses, hospitalizations, chronic conditions..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                      <textarea
                        value={newPatient.comprehensiveHistory.currentMedications}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          comprehensiveHistory: { ...prev.comprehensiveHistory, currentMedications: e.target.value }
                        }))}
                        placeholder="Current medications, dosages, frequency..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                      <textarea
                        value={newPatient.comprehensiveHistory.allergies}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          comprehensiveHistory: { ...prev.comprehensiveHistory, allergies: e.target.value }
                        }))}
                        placeholder="Drug allergies, food allergies, environmental allergies..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Surgical History</label>
                      <textarea
                        value={newPatient.comprehensiveHistory.surgicalHistory}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          comprehensiveHistory: { ...prev.comprehensiveHistory, surgicalHistory: e.target.value }
                        }))}
                        placeholder="Previous surgeries, dates, complications..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Status</label>
                      <select
                        value={newPatient.comprehensiveHistory.smokingStatus}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          comprehensiveHistory: { ...prev.comprehensiveHistory, smokingStatus: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="never">Never</option>
                        <option value="current">Current</option>
                        <option value="former">Former</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol Use</label>
                      <select
                        value={newPatient.comprehensiveHistory.alcoholUse}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          comprehensiveHistory: { ...prev.comprehensiveHistory, alcoholUse: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="none">None</option>
                        <option value="occasional">Occasional</option>
                        <option value="moderate">Moderate</option>
                        <option value="heavy">Heavy</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Family History</label>
                    <textarea
                      value={newPatient.comprehensiveHistory.familyHistory}
                      onChange={(e) => setNewPatient(prev => ({
                        ...prev,
                        comprehensiveHistory: { ...prev.comprehensiveHistory, familyHistory: e.target.value }
                      }))}
                      placeholder="Family history of diseases, genetic conditions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review of Systems */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Review of Systems</h3>
                  <p className="text-gray-600">Select all symptoms the patient is currently experiencing:</p>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(reviewOfSystemsCategories).map(([category, symptoms]) => (
                      <div key={category} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="space-y-2">
                          {symptoms.map(symptom => (
                            <button
                              key={symptom}
                              type="button"
                              onClick={() => addSymptomToHistory(symptom, category as keyof typeof reviewOfSystemsCategories)}
                              className={`w-full text-left p-2 text-sm rounded border transition-colors ${
                                newPatient.comprehensiveHistory.reviewOfSystems[category as keyof typeof reviewOfSystemsCategories].includes(symptom)
                                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {symptom}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Physical Exam & Vitals */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Physical Examination & Vital Signs</h3>
                  
                  {/* Vital Signs */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Vital Signs</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                        <input
                          type="text"
                          placeholder="120/80"
                          value={newPatient.vitalSigns.bloodPressure || ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, bloodPressure: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                        <input
                          type="text"
                          placeholder="36.5"
                          value={newPatient.vitalSigns.temperature || ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, temperature: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pulse (bpm)</label>
                        <input
                          type="text"
                          placeholder="72"
                          value={newPatient.vitalSigns.pulse || ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, pulse: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input
                          type="text"
                          placeholder="70"
                          value={newPatient.vitalSigns.weight || ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, weight: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* General Appearance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">General Appearance</label>
                    <textarea
                      value={newPatient.comprehensiveHistory.generalAppearance}
                      onChange={(e) => setNewPatient(prev => ({
                        ...prev,
                        comprehensiveHistory: { ...prev.comprehensiveHistory, generalAppearance: e.target.value }
                      }))}
                      placeholder="Patient appears well/ill, alert, oriented, in no acute distress..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>

                  {/* Systemic Examination */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Systemic Examination</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardiovascular</label>
                        <textarea
                          value={newPatient.comprehensiveHistory.systemicExamination.cardiovascular}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            comprehensiveHistory: {
                              ...prev.comprehensiveHistory,
                              systemicExamination: {
                                ...prev.comprehensiveHistory.systemicExamination,
                                cardiovascular: e.target.value
                              }
                            }
                          }))}
                          placeholder="Heart sounds, murmurs, rhythm..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory</label>
                        <textarea
                          value={newPatient.comprehensiveHistory.systemicExamination.respiratory}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            comprehensiveHistory: {
                              ...prev.comprehensiveHistory,
                              systemicExamination: {
                                ...prev.comprehensiveHistory.systemicExamination,
                                respiratory: e.target.value
                              }
                            }
                          }))}
                          placeholder="Breath sounds, chest expansion..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Abdominal</label>
                        <textarea
                          value={newPatient.comprehensiveHistory.systemicExamination.abdominal}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            comprehensiveHistory: {
                              ...prev.comprehensiveHistory,
                              systemicExamination: {
                                ...prev.comprehensiveHistory.systemicExamination,
                                abdominal: e.target.value
                              }
                            }
                          }))}
                          placeholder="Inspection, palpation, bowel sounds..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Neurological</label>
                        <textarea
                          value={newPatient.comprehensiveHistory.systemicExamination.neurological}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            comprehensiveHistory: {
                              ...prev.comprehensiveHistory,
                              systemicExamination: {
                                ...prev.comprehensiveHistory.systemicExamination,
                                neurological: e.target.value
                              }
                            }
                          }))}
                          placeholder="Mental status, reflexes, motor/sensory..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Assessment & Plan */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Assessment & Plan</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                      <textarea
                        value={newPatient.diagnosis}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, diagnosis: e.target.value }))}
                        placeholder="Primary and secondary diagnoses..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan</label>
                      <textarea
                        value={newPatient.treatment}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, treatment: e.target.value }))}
                        placeholder="Treatment approach, interventions..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Analysis</label>
                    <textarea
                      value={newPatient.analysisNotes}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, analysisNotes: e.target.value }))}
                      placeholder="Detailed analysis, differential diagnoses, prognosis..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  {/* Medication Prescription */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Prescribe Medications</h4>
                    <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <select
                            value={selectedMedication}
                            onChange={(e) => setSelectedMedication(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select medication</option>
                            {availableMedications.map(med => (
                              <option key={med.id} value={med.id}>
                                {med.name} - KES {med.price} (Stock: {med.stock})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={medicationDosage}
                            onChange={(e) => setMedicationDosage(e.target.value)}
                            placeholder="Dosage (e.g., 500mg)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <select
                            value={medicationFrequency}
                            onChange={(e) => setMedicationFrequency(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select frequency</option>
                            {medicalShortForms.map(form => (
                              <option key={form.code} value={form.code}>
                                {form.code} - {form.description}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            type="number"
                            min="1"
                            value={medicationDuration}
                            onChange={(e) => setMedicationDuration(parseInt(e.target.value))}
                            placeholder="Duration (days)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={medicationInstructions}
                            onChange={(e) => setMedicationInstructions(e.target.value)}
                            placeholder="Instructions (e.g., after meals)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      {selectedMedication && medicationFrequency && medicationDuration > 0 && (
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Calculated Quantity:</strong> {calculateTotalQuantity(medicationFrequency, medicationDuration)} tablets/capsules
                          </p>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={addMedicationToRecord}
                        disabled={!selectedMedication || !medicationFrequency}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Medication
                      </button>

                      {newPatient.medications.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Prescribed Medications:</h5>
                          {newPatient.medications.map((med, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div>
                                <p className="font-medium">{med.medicationName}</p>
                                <p className="text-sm text-gray-600">
                                  {med.dosage} - {med.frequency} for {med.duration} days
                                </p>
                                <p className="text-sm font-medium text-green-600">
                                  Qty: {med.quantity} - KES {med.totalCost}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setNewPatient(prev => ({
                                  ...prev,
                                  medications: prev.medications.filter((_, i) => i !== index)
                                }))}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                      <input
                        type="text"
                        value={newPatient.doctorName}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, doctorName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                      <input
                        type="date"
                        value={newPatient.followUpDate}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, followUpDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea
                      value={newPatient.notes}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddPatient(false);
                      setCurrentStep(1);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  {currentStep < 6 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Add Patient
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TCA Calculator Modal */}
      {showTCACalculator && !isReviewMode && (
        <TCACalculator
          onClose={() => setShowTCACalculator(null)}
          onSchedule={handleTCASchedule}
        />
      )}

      {/* Services Modal */}
      {showServicesModal && !isReviewMode && (
        <EnhancedPatientServicesModal
          patient={showServicesModal}
          onClose={() => setShowServicesModal(null)}
          onChargePatient={handleChargePatientForServices}
        />
      )}

      {/* Enhanced Patient View Modal */}
      {viewingPatient && (
        <EnhancedPatientView
          patient={viewingPatient}
          onClose={() => setViewingPatient(null)}
          onAddRecord={handleAddRecord}
          onSellToPatient={(items) => handleSellToPatient(viewingPatient.id, items)}
          isReviewMode={isReviewMode}
        />
      )}

      {/* Patient Revisit Modal */}
      {revisitPatient && !isReviewMode && (
        <PatientRevisit
          patient={revisitPatient}
          onClose={() => setRevisitPatient(null)}
          onAddRecord={handleAddRecord}
        />
      )}
    </div>
  );
}