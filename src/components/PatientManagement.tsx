import React, { useState } from 'react';
import { Search, Plus, User, Phone, Calendar, FileText, Edit, Eye } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, MedicalRecord, DispensedMedication } from '../types';
import { medications } from '../data/medications';
import { services } from '../data/services';

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
    email: '',
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
      email: newPatient.email,
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
      email: '',
      address: '',
      emergencyContact: ''
    });
    setShowAddPatient(false);
  };

  const addMedicationToRecord = () => {
    if (!selectedMedication) return;

    const medication = medications.find(med => med.id === selectedMedication);
    if (!medication) return;

    const dispensedMed: DispensedMedication = {
      medicationId: medication.id,
      medicationName: medication.name,
      quantity: medicationQuantity,
      dosage: medicationDosage,
      instructions: medicationInstructions,
      price: medication.price,
      totalCost: medication.price * medicationQuantity
    };

    setNewRecord(prev => ({
      ...prev,
      medications: [...prev.medications, dispensedMed]
    }));

    setSelectedMedication('');
    setMedicationQuantity(1);
    setMedicationDosage('');
    setMedicationInstructions('');
  };

  const removeMedicationFromRecord = (index: number) => {
    setNewRecord(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const record: MedicalRecord = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      date: new Date().toISOString(),
      symptoms: newRecord.symptoms,
      diagnosis: newRecord.diagnosis,
      treatment: newRecord.treatment,
      medications: newRecord.medications,
      notes: newRecord.notes,
      followUpDate: newRecord.followUpDate,
      doctorName: newRecord.doctorName
    };

    setPatients(prev => prev.map(patient => 
      patient.id === selectedPatient.id 
        ? { 
            ...patient, 
            medicalHistory: [record, ...patient.medicalHistory],
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
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

      {/* Add Medical Record Modal */}
      {showAddRecord && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Medical Record for {selectedPatient.name}
            </h3>
            <form onSubmit={handleAddRecord} className="space-y-4">
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
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment *</label>
                <textarea
                  required
                  value={newRecord.treatment}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, treatment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              {/* Medications Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prescribed Medications</label>
                <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <select
                        value={selectedMedication}
                        onChange={(e) => setSelectedMedication(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select medication</option>
                        {medications.map(med => (
                          <option key={med.id} value={med.id}>
                            {med.name} - KES {med.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        value={medicationQuantity}
                        onChange={(e) => setMedicationQuantity(parseInt(e.target.value))}
                        placeholder="Quantity"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                      <input
                        type="text"
                        value={medicationInstructions}
                        onChange={(e) => setMedicationInstructions(e.target.value)}
                        placeholder="Instructions (e.g., twice daily)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addMedicationToRecord}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Add Medication
                  </button>

                  {/* Added Medications List */}
                  {newRecord.medications.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Added Medications:</h4>
                      {newRecord.medications.map((med, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div>
                            <p className="font-medium">{med.medicationName}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {med.quantity} | Dosage: {med.dosage} | {med.instructions}
                            </p>
                            <p className="text-sm text-gray-600">Cost: KES {med.totalCost}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMedicationFromRecord(index)}
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
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Add Record
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddRecord(false);
                    setSelectedPatient(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Patient Modal */}
      {viewingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Patient Details: {viewingPatient.name}
              </h3>
              <button
                onClick={() => setViewingPatient(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Personal Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Age:</span> {viewingPatient.age}</p>
                  <p><span className="font-medium">Gender:</span> {viewingPatient.gender}</p>
                  <p><span className="font-medium">Phone:</span> {viewingPatient.phone}</p>
                  {viewingPatient.email && <p><span className="font-medium">Email:</span> {viewingPatient.email}</p>}
                  {viewingPatient.address && <p><span className="font-medium">Address:</span> {viewingPatient.address}</p>}
                  {viewingPatient.emergencyContact && <p><span className="font-medium">Emergency Contact:</span> {viewingPatient.emergencyContact}</p>}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Registration Info</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Registered:</span> {new Date(viewingPatient.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(viewingPatient.updatedAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Total Records:</span> {viewingPatient.medicalHistory.length}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Medical History</h4>
              {viewingPatient.medicalHistory.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {viewingPatient.medicalHistory.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">Dr. {record.doctorName}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Symptoms:</p>
                          <p className="text-gray-600">{record.symptoms}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Diagnosis:</p>
                          <p className="text-gray-600">{record.diagnosis}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Treatment:</p>
                          <p className="text-gray-600">{record.treatment}</p>
                        </div>
                        {record.followUpDate && (
                          <div>
                            <p className="font-medium text-gray-700">Follow-up:</p>
                            <p className="text-gray-600">{new Date(record.followUpDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                      {record.medications.length > 0 && (
                        <div className="mt-3">
                          <p className="font-medium text-gray-700 mb-2">Medications:</p>
                          <div className="space-y-1">
                            {record.medications.map((med, index) => (
                              <p key={index} className="text-sm text-gray-600">
                                • {med.medicationName} - {med.dosage} ({med.instructions}) - Qty: {med.quantity}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {record.notes && (
                        <div className="mt-3">
                          <p className="font-medium text-gray-700">Notes:</p>
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No medical records yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}