import React, { useState } from 'react';
import { Search, Plus, User, Phone, Calendar, FileText, Edit, Eye } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, MedicalRecord, DispensedMedication } from '../types';
import { medications } from '../data/medications';
import { medicalShortForms, calculateTotalQuantity } from '../data/medicalShortForms';
import EnhancedPatientView from './EnhancedPatientView';

export default function PatientManagement() {
  const [patients, setPatients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    phone: '',
    address: '',
    emergencyContact: ''
  });

  const [newRecord, setNewRecord] = useState({
    symptoms: '',
    diagnosis: '',
    treatment: '',
    medications: [] as DispensedMedication[],
    notes: '',
    followUpDate: '',
    doctorName: ''
  });

  const [selectedMedication, setSelectedMedication] = useState('');
  const [medicationQuantity, setMedicationQuantity] = useState(1);
  const [medicationDosage, setMedicationDosage] = useState('');
  const [medicationFrequency, setMedicationFrequency] = useState('');
  const [medicationDuration, setMedicationDuration] = useState(7);
  const [medicationInstructions, setMedicationInstructions] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const patient: Patient = {
      id: Date.now().toString(),
      name: newPatient.name,
      age: parseInt(newPatient.age),
      gender: newPatient.gender,
      phone: newPatient.phone,
      address: newPatient.address,
      emergencyContact: newPatient.emergencyContact,
      medicalHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPatients(prev => [patient, ...prev]);
    setNewPatient({
      name: '',
      age: '',
      gender: 'male',
      phone: '',
      address: '',
      emergencyContact: ''
    });
    setShowAddPatient(false);
  };

  const addMedicationToRecord = () => {
    if (!selectedMedication) return;

    const medication = medications.find(med => med.id === selectedMedication);
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

    setSelectedMedication('');
    setMedicationQuantity(1);
    setMedicationDosage('');
    setMedicationFrequency('');
    setMedicationDuration(7);
    setMedicationInstructions('');
  };

  const removeMedicationFromRecord = (index: number) => {
    setNewRecord(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleAddRecord = (record: Omit<MedicalRecord, 'id'>) => {
    if (!selectedPatient) return;

    const newMedicalRecord: MedicalRecord = {
      id: Date.now().toString(),
      ...record
    };

    setPatients(prev => prev.map(patient => 
      patient.id === selectedPatient.id 
        ? { 
            ...patient, 
            medicalHistory: [newMedicalRecord, ...patient.medicalHistory],
            updatedAt: new Date().toISOString()
          }
        : patient
    ));

    setNewRecord({
      symptoms: '',
      diagnosis: '',
      treatment: '',
      medications: [],
      notes: '',
      followUpDate: '',
      doctorName: ''
    });
    setShowAddRecord(false);
    setSelectedPatient(null);
  };

  const handleSellToPatient = (items: DispensedMedication[]) => {
    // This would be handled by the transaction system
    console.log('Selling to patient:', items);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
          <p className="text-gray-600">Manage patient records and medical history</p>
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
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewingPatient(patient)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPatient(patient);
                      setShowAddRecord(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Add Record</span>
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
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Patient</h3>
            <form onSubmit={handleAddPatient} className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
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
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Add Patient
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPatient(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
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
          onSellToPatient={handleSellToPatient}
        />
      )}
    </div>
  );
}