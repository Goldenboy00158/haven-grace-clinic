import React, { useState } from 'react';
import { Calendar, User, FileText, Plus, Activity, Heart, Thermometer, Weight, Ruler, Droplets, Wind, X, Save, Clock, Stethoscope, CheckCircle } from 'lucide-react';
import { Patient, MedicalRecord, DispensedMedication, VitalSigns } from '../types';
import { getTabletCapsuleMedications } from '../data/medications';
import { medicalShortForms, calculateTotalQuantity } from '../data/medicalShortForms';
import { useLocalStorage } from '../hooks/useLocalStorage';
import AutoSaveIndicator from './AutoSaveIndicator';

interface ClinicalService {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  severity?: 'mild' | 'moderate' | 'severe';
  duration?: number;
}

interface PatientRevisitProps {
  patient: Patient;
  onClose: () => void;
  onAddRecord: (record: Omit<MedicalRecord, 'id'>) => void;
}

export default function PatientRevisit({ patient, onClose, onAddRecord }: PatientRevisitProps) {
  const [activeTab, setActiveTab] = useState('history');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [services] = useLocalStorage<ClinicalService[]>('clinic-clinical-services', []);

  // Get only tablet/capsule medications for prescription
  const availableMedications = getTabletCapsuleMedications();

  const [newRecord, setNewRecord] = useState({
    // SMART Format Fields
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    pastSurgicalHistory: '',
    familyHistory: '',
    socialHistory: '',
    reviewOfSystems: '',
    // Legacy fields for compatibility
    symptoms: '',
    diagnosis: '',
    treatment: '',
    medications: [] as DispensedMedication[],
    vitalSigns: {} as VitalSigns,
    notes: '',
    followUpDate: '',
    doctorName: '',
    analysisNotes: '',
    servicesProvided: [] as string[]
  });

  // Updated Gynecologic History for revisit
  const [gynecologicUpdate, setGynecologicUpdate] = useState({
    gravida: patient.gynecologicHistory?.gravida || '',
    para: patient.gynecologicHistory?.para || '', // Now supports "1+2" format
    lastMenstrualPeriod: '',
    contraceptiveHistory: patient.gynecologicHistory?.contraceptiveHistory || '',
    pregnancyHistory: patient.gynecologicHistory?.pregnancyHistory || ''
  });

  const [selectedMedication, setSelectedMedication] = useState('');
  const [medicationDosage, setMedicationDosage] = useState('');
  const [medicationFrequency, setMedicationFrequency] = useState('');
  const [medicationDuration, setMedicationDuration] = useState(7);
  const [medicationInstructions, setMedicationInstructions] = useState('');

  const lastVisit = patient.medicalHistory[0];

  // Auto-save functionality
  React.useEffect(() => {
    if (!autoSaveEnabled || !showAddRecord) return;

    const autoSaveData = {
      patientId: patient.id,
      patientName: patient.name,
      timestamp: new Date().toISOString(),
      recordData: newRecord,
      gynecologicUpdate: patient.gender === 'female' ? gynecologicUpdate : null,
      visitType: 'revisit'
    };

    // Auto-save every 30 seconds if there's meaningful data
    const hasData = newRecord.chiefComplaint || newRecord.diagnosis || newRecord.treatment || 
                   Object.keys(newRecord.vitalSigns).length > 0 || newRecord.medications.length > 0;

    if (hasData) {
      const autoSaveTimer = setTimeout(() => {
        localStorage.setItem(`auto-save-visit-${patient.id}`, JSON.stringify(autoSaveData));
        setLastAutoSave(new Date());
      }, 30000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [newRecord, gynecologicUpdate, patient.id, patient.name, autoSaveEnabled, showAddRecord]);

  // Load auto-saved data on component mount
  React.useEffect(() => {
    const autoSavedData = localStorage.getItem(`auto-save-visit-${patient.id}`);
    if (autoSavedData && showAddRecord) {
      try {
        const savedData = JSON.parse(autoSavedData);
        if (savedData.recordData && confirm('Found auto-saved visit data. Would you like to restore it?')) {
          setNewRecord(savedData.recordData);
          if (savedData.gynecologicUpdate && patient.gender === 'female') {
            setGynecologicUpdate(savedData.gynecologicUpdate);
          }
        }
      } catch (error) {
        console.error('Error loading auto-saved data:', error);
      }
    }
  }, [showAddRecord, patient.id, patient.gender]);

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

    setNewRecord(prev => ({
      ...prev,
      medications: [...prev.medications, dispensedMed]
    }));

    // Reset form
    setSelectedMedication('');
    setMedicationDosage('');
    setMedicationFrequency('');
    setMedicationDuration(7);
    setMedicationInstructions('');
  };

  const handleAddRecord = () => {
    // Combine chief complaint and HPI into symptoms for legacy compatibility
    const combinedSymptoms = `Chief Complaint: ${newRecord.chiefComplaint}\n\nHistory of Present Illness: ${newRecord.historyOfPresentIllness}`;
    
    const record: Omit<MedicalRecord, 'id'> = {
      patientId: patient.id,
      date: new Date().toISOString(),
      // SMART format fields
      chiefComplaint: newRecord.chiefComplaint,
      historyOfPresentIllness: newRecord.historyOfPresentIllness,
      pastMedicalHistory: newRecord.pastMedicalHistory,
      pastSurgicalHistory: newRecord.pastSurgicalHistory,
      familyHistory: newRecord.familyHistory,
      socialHistory: newRecord.socialHistory,
      reviewOfSystems: newRecord.reviewOfSystems,
      // Legacy fields
      symptoms: combinedSymptoms || newRecord.symptoms,
      diagnosis: newRecord.diagnosis,
      treatment: newRecord.treatment,
      medications: newRecord.medications,
      vitalSigns: newRecord.vitalSigns,
      notes: newRecord.notes,
      followUpDate: newRecord.followUpDate,
      doctorName: newRecord.doctorName,
      analysisNotes: newRecord.analysisNotes
    };

    onAddRecord(record);
    
    // Clear auto-saved data after successful save
    localStorage.removeItem(`auto-save-visit-${patient.id}`);
    setLastAutoSave(null);
    
    setShowAddRecord(false);
    setNewRecord({
      chiefComplaint: '',
      historyOfPresentIllness: '',
      pastMedicalHistory: '',
      pastSurgicalHistory: '',
      familyHistory: '',
      socialHistory: '',
      reviewOfSystems: '',
      symptoms: '',
      diagnosis: '',
      treatment: '',
      medications: [],
      vitalSigns: {},
      notes: '',
      followUpDate: '',
      doctorName: '',
      analysisNotes: '',
      servicesProvided: []
    });
  };

  const toggleService = (serviceId: string) => {
    setNewRecord(prev => ({
      ...prev,
      servicesProvided: prev.servicesProvided.includes(serviceId)
        ? prev.servicesProvided.filter(id => id !== serviceId)
        : [...prev.servicesProvided, serviceId]
    }));
  };

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('blood pressure') || serviceName.toLowerCase().includes('bp')) return Heart;
    if (serviceName.toLowerCase().includes('blood sugar') || serviceName.toLowerCase().includes('rbs')) return Droplets;
    if (serviceName.toLowerCase().includes('wound')) return Activity;
    if (serviceName.toLowerCase().includes('sutur')) return Activity;
    if (serviceName.toLowerCase().includes('i&d') || serviceName.toLowerCase().includes('incision')) return Activity;
    return Stethoscope;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{patient.name} - Revisit</h2>
                <div className="flex items-center space-x-4 text-blue-100">
                  <span>Age: {patient.age}</span>
                  <span>Gender: {patient.gender}</span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Last visit: {lastVisit ? new Date(lastVisit.date).toLocaleDateString() : 'Never'}
                  </span>
                  {patient.gynecologicHistory && (
                    <span>G{patient.gynecologicHistory.gravida}P{patient.gynecologicHistory.para}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddRecord(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Record</span>
              </button>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Previous Visit Summary */}
        {lastVisit && (
          <div className="p-6 bg-blue-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Previous Visit Summary ({new Date(lastVisit.date).toLocaleDateString()})</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Chief Complaint:</span>
                <span className="ml-2">{lastVisit.chiefComplaint || 'Not recorded'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Diagnosis:</span>
                <span className="ml-2">{lastVisit.diagnosis}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Treatment:</span>
                <span className="ml-2">{lastVisit.treatment}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Doctor:</span>
                <span className="ml-2">{lastVisit.doctorName}</span>
              </div>
            </div>
          </div>
        )}

        {/* Add New Record Modal */}
        {showAddRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6">
              {/* Auto-save indicator */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add New Medical Record - SMART Format
                </h3>
                <AutoSaveIndicator
                  isEnabled={autoSaveEnabled}
                  lastSaveTime={lastAutoSave}
                  hasUnsavedChanges={false}
                  onToggle={setAutoSaveEnabled}
                />
              </div>

              <div className="space-y-6">
                {/* Updated Gynecologic History for Female Patients */}
                {patient.gender === 'female' && (
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Updated Gynecologic & Obstetric History</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gravida (G)</label>
                        <input
                          type="text"
                          value={gynecologicUpdate.gravida}
                          onChange={(e) => setGynecologicUpdate(prev => ({ ...prev, gravida: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Para (P)</label>
                        <input
                          type="text"
                          value={gynecologicUpdate.para}
                          onChange={(e) => setGynecologicUpdate(prev => ({ ...prev, para: e.target.value }))}
                          placeholder="e.g., 1+2 (live births + miscarriages)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: live births + miscarriages (e.g., 1+2)</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Menstrual Period</label>
                        <input
                          type="date"
                          value={gynecologicUpdate.lastMenstrualPeriod}
                          onChange={(e) => setGynecologicUpdate(prev => ({ ...prev, lastMenstrualPeriod: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SMART Format Medical History */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">SMART Format Assessment</h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint *</label>
                      <textarea
                        required
                        value={newRecord.chiefComplaint}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                        placeholder="Patient's main concern in their own words"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">History of Present Illness (HPI) *</label>
                      <textarea
                        required
                        value={newRecord.historyOfPresentIllness}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, historyOfPresentIllness: e.target.value }))}
                        placeholder="Detailed description of current illness"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Past Medical History</label>
                      <textarea
                        value={newRecord.pastMedicalHistory}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, pastMedicalHistory: e.target.value }))}
                        placeholder="Previous medical conditions, hospitalizations"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Past Surgical History</label>
                      <textarea
                        value={newRecord.pastSurgicalHistory}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, pastSurgicalHistory: e.target.value }))}
                        placeholder="Previous surgeries and procedures"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Family History</label>
                      <textarea
                        value={newRecord.familyHistory}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, familyHistory: e.target.value }))}
                        placeholder="Relevant family medical history"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Social History</label>
                      <textarea
                        value={newRecord.socialHistory}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, socialHistory: e.target.value }))}
                        placeholder="Smoking, alcohol, occupation, lifestyle"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review of Systems</label>
                    <textarea
                      value={newRecord.reviewOfSystems}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, reviewOfSystems: e.target.value }))}
                      placeholder="Systematic review of body systems"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Vital Signs */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Vital Signs</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                      <input
                        type="text"
                        placeholder="120/80"
                        value={newRecord.vitalSigns.bloodPressure || ''}
                        onChange={(e) => setNewRecord(prev => ({
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
                        value={newRecord.vitalSigns.temperature || ''}
                        onChange={(e) => setNewRecord(prev => ({
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
                        value={newRecord.vitalSigns.pulse || ''}
                        onChange={(e) => setNewRecord(prev => ({
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
                        value={newRecord.vitalSigns.weight || ''}
                        onChange={(e) => setNewRecord(prev => ({
                          ...prev,
                          vitalSigns: { ...prev.vitalSigns, weight: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Assessment and Plan */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assessment/Diagnosis *</label>
                    <textarea
                      required
                      value={newRecord.diagnosis}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                      placeholder="Clinical assessment and diagnosis"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan/Treatment *</label>
                    <textarea
                      required
                      value={newRecord.treatment}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, treatment: e.target.value }))}
                      placeholder="Treatment plan and management"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Medication Prescription */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Prescribe Medications (Tablets/Capsules Only)</h4>
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
                    {newRecord.medications.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-700">Prescribed Medications:</h5>
                        {newRecord.medications.map((med, index) => (
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
                              onClick={() => setNewRecord(prev => ({
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
                            Total Medication Cost: KES {newRecord.medications.reduce((sum, med) => sum + med.totalCost, 0)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name *</label>
                    <input
                      type="text"
                      required
                      value={newRecord.doctorName}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, doctorName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={newRecord.followUpDate}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, followUpDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleAddRecord}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save SMART Record</span>
                  </button>
                  <button
                    onClick={() => setShowAddRecord(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}