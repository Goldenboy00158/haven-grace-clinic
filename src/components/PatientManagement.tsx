import React, { useState } from 'react';
import { Search, Plus, User, Phone, Calendar, FileText, Edit, Eye, RotateCcw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, MedicalRecord, DispensedMedication, VitalSigns, Transaction } from '../types';
import { getTabletCapsuleMedications } from '../data/medications';
import { medicalShortForms, calculateTotalQuantity } from '../data/medicalShortForms';
import EnhancedPatientView from './EnhancedPatientView';
import PatientRevisit from './PatientRevisit';

export default function PatientManagement() {
  const [patients, setPatients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [revisitPatient, setRevisitPatient] = useState<Patient | null>(null);

  // Get only tablet/capsule medications for prescription
  const availableMedications = getTabletCapsuleMedications();

  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    phone: '',
    address: '',
    emergencyContact: '',
    // First visit medical record
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
    pregnancyHistory: ''
  });

  const [selectedMedication, setSelectedMedication] = useState('');
  const [medicationDosage, setMedicationDosage] = useState('');
  const [medicationFrequency, setMedicationFrequency] = useState('');
  const [medicationDuration, setMedicationDuration] = useState(7);
  const [medicationInstructions, setMedicationInstructions] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

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
    
    // Create first medical record if any medical data is provided
    const firstRecord: MedicalRecord | null = (
      newPatient.symptoms || 
      newPatient.diagnosis || 
      newPatient.treatment || 
      newPatient.medications.length > 0 ||
      Object.keys(newPatient.vitalSigns).length > 0
    ) ? {
      id: (Date.now() + 1).toString(),
      patientId: patientId,
      date: new Date().toISOString(),
      symptoms: newPatient.symptoms,
      diagnosis: newPatient.diagnosis,
      treatment: newPatient.treatment,
      medications: newPatient.medications,
      vitalSigns: newPatient.vitalSigns,
      notes: newPatient.notes,
      followUpDate: newPatient.followUpDate,
      doctorName: newPatient.doctorName,
      analysisNotes: newPatient.analysisNotes
    } : null;

    const patient: Patient = {
      id: patientId,
      name: newPatient.name,
      age: parseInt(newPatient.age),
      gender: newPatient.gender,
      phone: newPatient.phone,
      address: newPatient.address,
      emergencyContact: newPatient.emergencyContact,
      medicalHistory: firstRecord ? [firstRecord] : [],
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
      pregnancyHistory: ''
    });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
          <p className="text-gray-600">Manage patient records and medical history ({availableMedications.length} medications available for prescription)</p>
        </div>
        <button
          onClick={() => setShowAddPatient(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Patient</span>
        </button>
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
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setRevisitPatient(patient)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Revisit</span>
                  </button>
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

      {/* Add Patient Modal */}
      {showAddPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Add New Patient with First Visit</h3>
            <form onSubmit={handleAddPatient} className="space-y-6">
              {/* Patient Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Patient Information</h4>
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
              </div>

              {/* Gynecologic and Obstetric History (for females) */}
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pregnancy History</label>
                      <textarea
                        value={newPatient.pregnancyHistory}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, pregnancyHistory: e.target.value }))}
                        placeholder="Previous pregnancies, complications, deliveries..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Vital Signs */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Vital Signs (First Visit)</h4>
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

              {/* Clinical Information */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Clinical Information (First Visit)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                    <textarea
                      value={newPatient.symptoms}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, symptoms: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                    <textarea
                      value={newPatient.diagnosis}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, diagnosis: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan</label>
                  <textarea
                    value={newPatient.treatment}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, treatment: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Analysis</label>
                  <textarea
                    value={newPatient.analysisNotes}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, analysisNotes: e.target.value }))}
                    placeholder="Detailed analysis of patient's condition, prognosis, and recommendations..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {/* Medication Prescription */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Prescribe Medications (Tablets/Capsules Only)</h4>
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
                  
                  {/* Quantity Calculator Display */}
                  {selectedMedication && medicationFrequency && medicationDuration > 0 && (
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Calculated Quantity:</strong> {calculateTotalQuantity(medicationFrequency, medicationDuration)} tablets/capsules
                        <br />
                        <span className="text-xs">
                          ({medicationFrequency} × {medicationDuration} days = {calculateTotalQuantity(medicationFrequency, medicationDuration)} units)
                        </span>
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

                  {/* Prescribed Medications List */}
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
                            <p className="text-sm text-gray-500">{med.instructions}</p>
                            <p className="text-sm font-medium text-green-600">
                              Qty: {med.quantity} tablets/capsules - KES {med.totalCost}
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
                      <div className="bg-green-100 p-3 rounded-lg">
                        <p className="font-semibold text-green-800">
                          Total Medication Cost: KES {newPatient.medications.reduce((sum, med) => sum + med.totalCost, 0)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
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

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Add Patient
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPatient(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Patient View Modal */}
      {viewingPatient && (
        <EnhancedPatientView
          patient={viewingPatient}
          onClose={() => setViewingPatient(null)}
          onAddRecord={handleAddRecord}
          onSellToPatient={(items) => handleSellToPatient(viewingPatient.id, items)}
        />
      )}

      {/* Patient Revisit Modal */}
      {revisitPatient && (
        <PatientRevisit
          patient={revisitPatient}
          onClose={() => setRevisitPatient(null)}
          onAddRecord={handleAddRecord}
        />
      )}
    </div>
  );
}