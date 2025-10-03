import React, { useState } from 'react';
import { User, Phone, Calendar, FileText, Plus, ShoppingCart, Activity, Thermometer, Heart, Weight, Ruler, Droplets, Wind, X, CheckCircle } from 'lucide-react';
import { Patient, MedicalRecord, DispensedMedication, VitalSigns, Transaction } from '../types';
import { getTabletCapsuleMedications } from '../data/medications';
import { medicalShortForms, calculateTotalQuantity } from '../data/medicalShortForms';
import { useLocalStorage } from '../hooks/useLocalStorage';
import VitalSignsDisplay from './VitalSignsDisplay';
import AutoSaveIndicator from './AutoSaveIndicator';

interface EnhancedPatientViewProps {
  patient: Patient;
  onClose: () => void;
  onAddRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  onSellToPatient: (items: DispensedMedication[]) => void;
  isReviewMode?: boolean;
}

export default function EnhancedPatientView({ patient, onClose, onAddRecord, onSellToPatient, isReviewMode = false }: EnhancedPatientViewProps) {
  const [activeTab, setActiveTab] = useState('history');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<DispensedMedication[]>([]);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);

  // Get only tablet/capsule medications for prescription
  const availableMedications = getTabletCapsuleMedications();

  const [newRecord, setNewRecord] = useState({
    symptoms: '',
    diagnosis: '',
    treatment: '',
    medications: [] as DispensedMedication[],
    vitalSigns: {} as VitalSigns,
    notes: '',
    followUpDate: '',
    doctorName: '',
    analysisNotes: ''
  });

  const [selectedMedication, setSelectedMedication] = useState('');
  const [medicationQuantity, setMedicationQuantity] = useState(1);
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
      visitType: 'regular'
    };

    // Auto-save every 30 seconds if there's meaningful data
    const hasData = newRecord.symptoms || newRecord.diagnosis || newRecord.treatment || 
                   Object.keys(newRecord.vitalSigns).length > 0 || newRecord.medications.length > 0;

    if (hasData) {
      const autoSaveTimer = setTimeout(() => {
        localStorage.setItem(`auto-save-visit-${patient.id}`, JSON.stringify(autoSaveData));
        setLastAutoSave(new Date());
      }, 30000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [newRecord, patient.id, patient.name, autoSaveEnabled, showAddRecord]);

  // Load auto-saved data on component mount
  React.useEffect(() => {
    const autoSavedData = localStorage.getItem(`auto-save-visit-${patient.id}`);
    if (autoSavedData && showAddRecord) {
      try {
        const savedData = JSON.parse(autoSavedData);
        if (savedData.recordData && confirm('Found auto-saved visit data. Would you like to restore it?')) {
          setNewRecord(savedData.recordData);
        }
      } catch (error) {
        console.error('Error loading auto-saved data:', error);
      }
    }
  }, [showAddRecord, patient.id]);

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
    setMedicationQuantity(1);
    setMedicationDosage('');
    setMedicationFrequency('');
    setMedicationDuration(7);
    setMedicationInstructions('');
  };

  const handleAddRecord = () => {
    const record: Omit<MedicalRecord, 'id'> = {
      patientId: patient.id,
      date: new Date().toISOString(),
      symptoms: newRecord.symptoms,
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
      symptoms: '',
      diagnosis: '',
      treatment: '',
      medications: [],
      vitalSigns: {},
      notes: '',
      followUpDate: '',
      doctorName: '',
      analysisNotes: ''
    });
  };

  const addToSale = (medication: any) => {
    const existingItem = selectedItems.find(item => item.medicationId === medication.id);
    if (existingItem) {
      setSelectedItems(prev => prev.map(item => 
        item.medicationId === medication.id 
          ? { ...item, quantity: item.quantity + 1, totalCost: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setSelectedItems(prev => [...prev, {
        medicationId: medication.id,
        medicationName: medication.name,
        quantity: 1,
        dosage: '',
        frequency: 'OD',
        duration: 7,
        instructions: '',
        price: medication.price,
        totalCost: medication.price
      }]);
    }
  };

  const completeSale = () => {
    if (selectedItems.length === 0) return;

    const totalAmount = selectedItems.reduce((sum, item) => sum + item.totalCost, 0);
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'patient',
      patientId: patient.id,
      patientName: patient.name,
      items: selectedItems,
      totalAmount,
      date: new Date().toISOString(),
      paymentMethod: 'cash',
      status: 'completed'
    };

    setTransactions(prev => [transaction, ...prev]);
    onSellToPatient(selectedItems);
    setSelectedItems([]);
    setShowSellModal(false);
  };

  // Get patient height for BMI calculation
  const getPatientHeight = (): number | undefined => {
    // Look for height in the most recent vital signs
    for (const record of patient.medicalHistory) {
      if (record.vitalSigns?.height) {
        return parseFloat(record.vitalSigns.height);
      }
    }
    return undefined;
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
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <div className="flex items-center space-x-4 text-blue-100">
                  <span>Age: {patient.age}</span>
                  <span>Gender: {patient.gender}</span>
                  <span className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {patient.phone}
                  </span>
                  {patient.gynecologicHistory && (
                    <span>G{patient.gynecologicHistory.gravida}P{patient.gynecologicHistory.para}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {!isReviewMode && (
                <>
                  <button
                    onClick={() => setShowSellModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Quick Sale</span>
                  </button>
                  <button
                    onClick={() => {
                      const event = new CustomEvent('open-patient-services', { detail: patient });
                      window.dispatchEvent(event);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Stethoscope className="h-4 w-4" />
                    <span>All Services</span>
                  </button>
                  {patient.gender === 'female' && (
                    <button
                      onClick={() => {
                        const event = new CustomEvent('open-tca-calculator', { detail: patient });
                        window.dispatchEvent(event);
                      }}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <Heart className="h-4 w-4" />
                      <span>TCA Calculator</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const event = new CustomEvent('open-document-generator', { detail: patient });
                      window.dispatchEvent(event);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Documents</span>
                  </button>
                  <button
                    onClick={() => setShowAddRecord(true)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Record</span>
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Gynecologic History for Females */}
        {patient.gynecologicHistory && (
          <div className="p-6 bg-pink-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Gynecologic & Obstetric History</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Gravida:</span>
                <span className="ml-2">{patient.gynecologicHistory.gravida || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Para:</span>
                <span className="ml-2">{patient.gynecologicHistory.para || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">LMP:</span>
                <span className="ml-2">
                  {patient.gynecologicHistory.lastMenstrualPeriod 
                    ? new Date(patient.gynecologicHistory.lastMenstrualPeriod).toLocaleDateString()
                    : 'N/A'
                  }
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Contraception:</span>
                <span className="ml-2">{patient.gynecologicHistory.contraceptiveHistory || 'N/A'}</span>
              </div>
            </div>
            {patient.gynecologicHistory.pregnancyHistory && (
              <div className="mt-3">
                <span className="font-medium text-gray-700">Pregnancy History:</span>
                <p className="text-gray-600 mt-1">{patient.gynecologicHistory.pregnancyHistory}</p>
                <button
                  onClick={() => {
                    const event = new CustomEvent('open-document-generator', { detail: patient });
                    window.dispatchEvent(event);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Documents</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b">
          <div className="flex">
            {[
              { id: 'history', name: 'Medical History', icon: FileText },
              { id: 'vitals', name: 'Vital Signs', icon: Activity },
              { id: 'analysis', name: 'Analysis', icon: Thermometer }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'history' && (
            <div className="space-y-6">
              {patient.medicalHistory.length > 0 ? (
                patient.medicalHistory.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-600">Dr. {record.doctorName}</span>
                      </div>
                      {record.vitalSigns && Object.keys(record.vitalSigns).length > 0 && (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <Activity className="h-4 w-4" />
                          <span>Vitals Recorded</span>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Symptoms</h4>
                          <p className="text-gray-700 bg-white p-3 rounded border">{record.symptoms}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                          <p className="text-gray-700 bg-white p-3 rounded border">{record.diagnosis}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Treatment</h4>
                          <p className="text-gray-700 bg-white p-3 rounded border">{record.treatment}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {record.vitalSigns && Object.keys(record.vitalSigns).length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Vital Signs</h4>
                            <VitalSignsDisplay 
                              vitalSigns={record.vitalSigns}
                              patientAge={patient.age}
                              patientGender={patient.gender}
                              patientHeight={getPatientHeight()}
                              compact={true}
                            />
                          </div>
                        )}

                        {record.medications.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Prescribed Medications</h4>
                            <div className="bg-white rounded border divide-y">
                              {record.medications.map((med, index) => (
                                <div key={index} className="p-3">
                                  <div className="font-medium text-gray-900">{med.medicationName}</div>
                                  <div className="text-sm text-gray-600">
                                    {med.dosage} - {med.frequency} for {med.duration} days
                                  </div>
                                  <div className="text-sm text-gray-500">{med.instructions}</div>
                                  <div className="text-sm font-medium text-green-600">
                                    Qty: {med.quantity} tablets/capsules - KES {med.totalCost}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {record.analysisNotes && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Clinical Analysis</h4>
                            <p className="text-gray-700 bg-white p-3 rounded border">{record.analysisNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {record.notes && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                        <p className="text-gray-700 bg-white p-3 rounded border">{record.notes}</p>
                      </div>
                    )}

                    {record.followUpDate && (
                      <div className="mt-4 flex items-center space-x-2 text-sm text-blue-600">
                        <Calendar className="h-4 w-4" />
                        <span>Follow-up: {new Date(record.followUpDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No medical records yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'vitals' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Vital Signs History with Normal Range Analysis</h3>
              {patient.medicalHistory
                .filter(record => record.vitalSigns && Object.keys(record.vitalSigns).length > 0)
                .map((record) => (
                  <div key={record.id} className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-600">Dr. {record.doctorName}</span>
                    </div>
                    <VitalSignsDisplay 
                      vitalSigns={record.vitalSigns}
                      patientAge={patient.age}
                      patientGender={patient.gender}
                      patientHeight={getPatientHeight()}
                      showInterpretation={true}
                    />
                  </div>
                ))}
              
              {patient.medicalHistory.filter(record => record.vitalSigns && Object.keys(record.vitalSigns).length > 0).length === 0 && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No vital signs recorded yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Clinical Analysis</h3>
              {patient.medicalHistory
                .filter(record => record.analysisNotes)
                .map((record) => (
                  <div key={record.id} className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-600">Dr. {record.doctorName}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Diagnosis: {record.diagnosis}</h4>
                      <p className="text-gray-700">{record.analysisNotes}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Add Record Modal */}
        {showAddRecord && !isReviewMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              {/* Auto-save indicator */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add Medical Record for {patient.name}
                </h3>
                <AutoSaveIndicator
                  isEnabled={autoSaveEnabled}
                  lastSaveTime={lastAutoSave}
                  hasUnsavedChanges={false}
                  onToggle={setAutoSaveEnabled}
                />
              </div>

              {/* Show previous visit info */}
              {lastVisit && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">Previous Visit ({new Date(lastVisit.date).toLocaleDateString()})</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Diagnosis:</span> {lastVisit.diagnosis}
                    </div>
                    <div>
                      <span className="font-medium">Treatment:</span> {lastVisit.treatment}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                      <input
                        type="text"
                        placeholder="170"
                        value={newRecord.vitalSigns.height || ''}
                        onChange={(e) => setNewRecord(prev => ({
                          ...prev,
                          vitalSigns: { ...prev.vitalSigns, height: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate (/min)</label>
                      <input
                        type="text"
                        placeholder="16"
                        value={newRecord.vitalSigns.respiratoryRate || ''}
                        onChange={(e) => setNewRecord(prev => ({
                          ...prev,
                          vitalSigns: { ...prev.vitalSigns, respiratoryRate: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation (%)</label>
                      <input
                        type="text"
                        placeholder="98"
                        value={newRecord.vitalSigns.oxygenSaturation || ''}
                        onChange={(e) => setNewRecord(prev => ({
                          ...prev,
                          vitalSigns: { ...prev.vitalSigns, oxygenSaturation: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Live Vital Signs Assessment */}
                  {Object.keys(newRecord.vitalSigns).length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Live Assessment:</h5>
                      <VitalSignsDisplay 
                        vitalSigns={newRecord.vitalSigns}
                        patientAge={patient.age}
                        patientGender={patient.gender}
                        patientHeight={newRecord.vitalSigns.height ? parseFloat(newRecord.vitalSigns.height) : getPatientHeight()}
                        compact={true}
                      />
                    </div>
                  )}
                </div>

                {/* Clinical Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms *</label>
                    <textarea
                      required
                      value={newRecord.symptoms}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, symptoms: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
                    <textarea
                      required
                      value={newRecord.diagnosis}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan *</label>
                  <textarea
                    required
                    value={newRecord.treatment}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, treatment: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Analysis</label>
                  <textarea
                    value={newRecord.analysisNotes}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, analysisNotes: e.target.value }))}
                    placeholder="Detailed analysis of patient's condition, prognosis, and recommendations..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Add Medical Record
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

        {/* Sell Items Modal */}
        {showSellModal && !isReviewMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Sell Items to {patient.name}
              </h3>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Available Medications */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Available Medications (Tablets/Capsules)</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {availableMedications.map((medication) => (
                      <div key={medication.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{medication.name}</p>
                          <p className="text-sm text-gray-600">KES {medication.price} - Stock: {medication.stock}</p>
                          <p className="text-xs text-gray-500">{medication.category}</p>
                        </div>
                        <button
                          onClick={() => addToSale(medication)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Selected Items</h4>
                  {selectedItems.length > 0 ? (
                    <div className="space-y-3">
                      {selectedItems.map((item, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{item.medicationName}</span>
                            <button
                              onClick={() => setSelectedItems(prev => prev.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <label className="block text-gray-600">Quantity:</label>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQuantity = parseInt(e.target.value) || 1;
                                  setSelectedItems(prev => prev.map((si, i) => 
                                    i === index 
                                      ? { ...si, quantity: newQuantity, totalCost: newQuantity * si.price }
                                      : si
                                  ));
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600">Total:</label>
                              <span className="font-medium">KES {item.totalCost}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total Amount:</span>
                          <span className="text-xl font-bold text-green-600">
                            KES {selectedItems.reduce((sum, item) => sum + item.totalCost, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No items selected</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-6">
                <button
                  onClick={completeSale}
                  disabled={selectedItems.length === 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Sale - KES {selectedItems.reduce((sum, item) => sum + item.totalCost, 0)}
                </button>
                <button
                  onClick={() => setShowSellModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}