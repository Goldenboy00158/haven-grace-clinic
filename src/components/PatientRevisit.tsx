import React, { useState } from 'react';
import { Calendar, User, FileText, Plus, Activity, Heart, Thermometer, Weight, Ruler, Droplets, Wind, X, Save, Clock, Stethoscope } from 'lucide-react';
import { Patient, MedicalRecord, DispensedMedication, VitalSigns } from '../types';
import { getTabletCapsuleMedications } from '../data/medications';
import { medicalShortForms, calculateTotalQuantity } from '../data/medicalShortForms';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
  const [services] = useLocalStorage<ClinicalService[]>('clinic-clinical-services', []);

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
    analysisNotes: '',
    servicesProvided: [] as string[]
  });

  const [selectedMedication, setSelectedMedication] = useState('');
  const [medicationDosage, setMedicationDosage] = useState('');
  const [medicationFrequency, setMedicationFrequency] = useState('');
  const [medicationDuration, setMedicationDuration] = useState(7);
  const [medicationInstructions, setMedicationInstructions] = useState('');

  const lastVisit = patient.medicalHistory[0];

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
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Previous Visit Summary</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Date:</span>
                <span className="ml-2">{new Date(lastVisit.date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Doctor:</span>
                <span className="ml-2">{lastVisit.doctorName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Diagnosis:</span>
                <span className="ml-2">{lastVisit.diagnosis}</span>
              </div>
            </div>
            {lastVisit.followUpDate && (
              <div className="mt-2 text-sm">
                <span className="font-medium text-gray-700">Follow-up Due:</span>
                <span className="ml-2 text-blue-600">{new Date(lastVisit.followUpDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b">
          <div className="flex">
            {[
              { id: 'history', name: 'Medical History', icon: FileText },
              { id: 'vitals', name: 'Vital Signs Trends', icon: Activity },
              { id: 'medications', name: 'Medication History', icon: Droplets }
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
              <h3 className="text-lg font-semibold text-gray-900">Complete Medical History</h3>
              {patient.medicalHistory.length > 0 ? (
                patient.medicalHistory.map((record, index) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">
                          Visit #{patient.medicalHistory.length - index} - {new Date(record.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-600">Dr. {record.doctorName}</span>
                      </div>
                      {index === 0 && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Latest Visit
                        </span>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Chief Complaint & Symptoms</h4>
                          <p className="text-gray-700 bg-white p-3 rounded border">{record.symptoms}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                          <p className="text-gray-700 bg-white p-3 rounded border">{record.diagnosis}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Treatment Plan</h4>
                          <p className="text-gray-700 bg-white p-3 rounded border">{record.treatment}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {record.vitalSigns && Object.keys(record.vitalSigns).length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Vital Signs</h4>
                            <div className="bg-white p-3 rounded border space-y-2">
                              {record.vitalSigns.bloodPressure && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Blood Pressure:</span>
                                  <span className="font-medium">{record.vitalSigns.bloodPressure} mmHg</span>
                                </div>
                              )}
                              {record.vitalSigns.temperature && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Temperature:</span>
                                  <span className="font-medium">{record.vitalSigns.temperature}°C</span>
                                </div>
                              )}
                              {record.vitalSigns.pulse && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Pulse:</span>
                                  <span className="font-medium">{record.vitalSigns.pulse} bpm</span>
                                </div>
                              )}
                              {record.vitalSigns.weight && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Weight:</span>
                                  <span className="font-medium">{record.vitalSigns.weight} kg</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {record.medications.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Medications Prescribed</h4>
                            <div className="bg-white rounded border divide-y">
                              {record.medications.map((med, medIndex) => (
                                <div key={medIndex} className="p-3">
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
                        <span>Follow-up scheduled: {new Date(record.followUpDate).toLocaleDateString()}</span>
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
              <h3 className="text-lg font-semibold text-gray-900">Vital Signs Trends</h3>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {record.vitalSigns?.bloodPressure && (
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <Heart className="h-6 w-6 text-red-600 mx-auto mb-1" />
                          <div className="text-sm text-gray-600">Blood Pressure</div>
                          <div className="font-semibold text-red-600">{record.vitalSigns.bloodPressure}</div>
                        </div>
                      )}
                      {record.vitalSigns?.temperature && (
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <Thermometer className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                          <div className="text-sm text-gray-600">Temperature</div>
                          <div className="font-semibold text-orange-600">{record.vitalSigns.temperature}°C</div>
                        </div>
                      )}
                      {record.vitalSigns?.weight && (
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <Weight className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                          <div className="text-sm text-gray-600">Weight</div>
                          <div className="font-semibold text-blue-600">{record.vitalSigns.weight} kg</div>
                        </div>
                      )}
                      {record.vitalSigns?.pulse && (
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <Activity className="h-6 w-6 text-green-600 mx-auto mb-1" />
                          <div className="text-sm text-gray-600">Pulse</div>
                          <div className="font-semibold text-green-600">{record.vitalSigns.pulse} bpm</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Medication History</h3>
              {patient.medicalHistory
                .filter(record => record.medications.length > 0)
                .map((record) => (
                  <div key={record.id} className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-600">Dr. {record.doctorName}</span>
                    </div>
                    <div className="space-y-3">
                      {record.medications.map((med, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{med.medicationName}</div>
                            <div className="text-sm text-gray-600">
                              {med.dosage} - {med.frequency} for {med.duration} days
                            </div>
                            <div className="text-sm text-gray-500">{med.instructions}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">Qty: {med.quantity}</div>
                            <div className="text-sm text-green-600">KES {med.totalCost}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Add New Record Modal */}
        {showAddRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Add New Medical Record for {patient.name}
              </h3>

              <div className="space-y-6">
                {/* Services Provided */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Services Provided Today</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {services.map((service) => {
                      const Icon = getServiceIcon(service.name);
                      const isSelected = newRecord.servicesProvided.includes(service.id);
                      return (
                        <button
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{service.name}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">KES {service.price}</div>
                        </button>
                      );
                    })}
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
                    <span>Save Medical Record</span>
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