import React, { useState, useMemo } from 'react';
import { Search, Plus, User, Phone, Calendar, FileText, ShoppingCart, Activity, Filter, Download, CreditCard as Edit, Trash2, Heart } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, MedicalRecord, Transaction, Medication } from '../types';
import { medications } from '../data/medications';
import EnhancedPatientView from './EnhancedPatientView';
import CombinedSalesModal from './CombinedSalesModal';
import PatientRecordPrintModal from './PatientRecordPrintModal';

interface PatientManagementProps {
  isReviewMode?: boolean;
}

export default function PatientManagement({ isReviewMode = false }: PatientManagementProps) {
  const [patients, setPatients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [medicationData, setMedicationData] = useLocalStorage<Medication[]>('clinic-medications', medications);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPatientView, setShowPatientView] = useState<Patient | null>(null);
  const [showSalesModal, setShowSalesModal] = useState<Patient | null>(null);
  const [showPrintRecordsModal, setShowPrintRecordsModal] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: 0,
    gender: 'female' as 'male' | 'female' | 'other',
    phone: '',
    address: '',
    emergencyContact: '',
    notes: '',
    gynecologicHistory: {
      gravida: '',
      para: '',
      lastMenstrualPeriod: '',
      contraceptiveHistory: '',
      pregnancyHistory: ''
    }
  });

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.phone.includes(searchTerm);
      const matchesGender = !genderFilter || patient.gender === genderFilter;
      const matchesAge = !ageFilter || 
        (ageFilter === 'child' && patient.age < 18) ||
        (ageFilter === 'adult' && patient.age >= 18 && patient.age < 65) ||
        (ageFilter === 'elderly' && patient.age >= 65);
      
      return matchesSearch && matchesGender && matchesAge;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [patients, searchTerm, genderFilter, ageFilter]);

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.phone || newPatient.age <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const patient: Patient = {
      id: Date.now().toString(),
      name: newPatient.name,
      age: newPatient.age,
      gender: newPatient.gender,
      phone: newPatient.phone,
      address: newPatient.address,
      emergencyContact: newPatient.emergencyContact,
      notes: newPatient.notes,
      medicalHistory: [],
      gynecologicHistory: newPatient.gender === 'female' ? newPatient.gynecologicHistory : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPatients(prev => [patient, ...prev]);
    resetForm();
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setNewPatient({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address || '',
      emergencyContact: patient.emergencyContact || '',
      notes: patient.notes || '',
      gynecologicHistory: patient.gynecologicHistory || {
        gravida: '',
        para: '',
        lastMenstrualPeriod: '',
        contraceptiveHistory: '',
        pregnancyHistory: ''
      }
    });
    setShowAddModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingPatient) return;

    const updatedPatient: Patient = {
      ...editingPatient,
      name: newPatient.name,
      age: newPatient.age,
      gender: newPatient.gender,
      phone: newPatient.phone,
      address: newPatient.address,
      emergencyContact: newPatient.emergencyContact,
      notes: newPatient.notes,
      gynecologicHistory: newPatient.gender === 'female' ? newPatient.gynecologicHistory : undefined,
      updatedAt: new Date().toISOString()
    };

    setPatients(prev => prev.map(p => p.id === editingPatient.id ? updatedPatient : p));
    resetForm();
  };

  const handleDeletePatient = (patientId: string) => {
    if (confirm('Are you sure you want to delete this patient? This will also delete all their medical records.')) {
      setPatients(prev => prev.filter(p => p.id !== patientId));
    }
  };

  const resetForm = () => {
    setNewPatient({
      name: '',
      age: 0,
      gender: 'female',
      phone: '',
      address: '',
      emergencyContact: '',
      notes: '',
      gynecologicHistory: {
        gravida: '',
        para: '',
        lastMenstrualPeriod: '',
        contraceptiveHistory: '',
        pregnancyHistory: ''
      }
    });
    setEditingPatient(null);
    setShowAddModal(false);
  };

  const handleAddRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      ...record
    };

    setPatients(prev => prev.map(patient => 
      patient.id === record.patientId 
        ? { 
            ...patient, 
            medicalHistory: [newRecord, ...patient.medicalHistory],
            updatedAt: new Date().toISOString()
          }
        : patient
    ));

    // Update medication stock if medications were prescribed
    if (record.medications.length > 0) {
      setMedicationData(prev => prev.map(med => {
        const prescribedMed = record.medications.find(m => m.medicationId === med.id);
        if (prescribedMed) {
          return { ...med, stock: Math.max(0, med.stock - prescribedMed.quantity) };
        }
        return med;
      }));
    }
  };

  const handleSaleComplete = (items: any[], totalAmount: number, paymentMethod: string, customerInfo: any) => {
    // Update medication stock for medication items
    setMedicationData(prev => prev.map(med => {
      const saleItem = items.find(item => item.id === med.id && item.type === 'medication');
      if (saleItem) {
        return { ...med, stock: Math.max(0, med.stock - saleItem.quantity) };
      }
      return med;
    }));
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: customerInfo.type,
      patientId: customerInfo.patientId,
      patientName: customerInfo.patientName,
      items: items.map(item => ({
        medicationId: item.id,
        medicationName: item.name,
        quantity: item.quantity,
        dosage: '',
        frequency: '',
        duration: 0,
        instructions: item.description,
        price: item.price,
        totalCost: item.totalCost
      })),
      totalAmount,
      date: new Date().toISOString(),
      paymentMethod,
      status: 'completed'
    };

    setTransactions(prev => [transaction, ...prev]);
    setShowSalesModal(null);
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Age', 'Gender', 'Phone', 'Address', 'Emergency Contact', 'Medical Records', 'Last Visit', 'Gravida', 'Para'],
      ...filteredPatients.map(patient => [
        patient.name,
        patient.age.toString(),
        patient.gender,
        patient.phone,
        patient.address || '',
        patient.emergencyContact || '',
        patient.medicalHistory.length.toString(),
        patient.medicalHistory.length > 0 ? new Date(patient.medicalHistory[0].date).toLocaleDateString() : 'Never',
        patient.gynecologicHistory?.gravida || '',
        patient.gynecologicHistory?.para || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patients-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: patients.length,
    male: patients.filter(p => p.gender === 'male').length,
    female: patients.filter(p => p.gender === 'female').length,
    children: patients.filter(p => p.age < 18).length,
    adults: patients.filter(p => p.age >= 18 && p.age < 65).length,
    elderly: patients.filter(p => p.age >= 65).length,
    recentVisits: patients.filter(p => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return p.medicalHistory.some(record => new Date(record.date) >= oneWeekAgo);
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
          <p className="text-gray-600">Manage patient records and medical history</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportData}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          {!isReviewMode && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <User className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <User className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{stats.male}</div>
          <div className="text-sm text-gray-600">Male</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <Heart className="h-6 w-6 text-pink-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-pink-600">{stats.female}</div>
          <div className="text-sm text-gray-600">Female</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <User className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{stats.children}</div>
          <div className="text-sm text-gray-600">Children</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <User className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">{stats.adults}</div>
          <div className="text-sm text-gray-600">Adults</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <User className="h-6 w-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">{stats.elderly}</div>
          <div className="text-sm text-gray-600">Elderly</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <Activity className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-indigo-600">{stats.recentVisits}</div>
          <div className="text-sm text-gray-600">Recent</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Ages</option>
            <option value="child">Children (&lt;18)</option>
            <option value="adult">Adults (18-64)</option>
            <option value="elderly">Elderly (65+)</option>
          </select>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    patient.gender === 'female' ? 'bg-pink-100' : 
                    patient.gender === 'male' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {patient.gender === 'female' ? (
                      <Heart className="h-6 w-6 text-pink-600" />
                    ) : (
                      <User className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{patient.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Age: {patient.age}</span>
                      <span>Gender: {patient.gender}</span>
                      <span className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {patient.phone}
                      </span>
                      {patient.gynecologicHistory && (
                        <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                          G{patient.gynecologicHistory.gravida}P{patient.gynecologicHistory.para}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {patient.medicalHistory.length} records
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Last visit: {patient.medicalHistory.length > 0 
                          ? new Date(patient.medicalHistory[0].date).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                      {patient.address && (
                        <span>Address: {patient.address}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowPatientView(patient)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Records</span>
                  </button>
                  {!isReviewMode && (
                    <>
                      <button
                        onClick={() => setShowSalesModal(patient)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Quick Sale</span>
                      </button>
                      <button
                        onClick={() => {
                          // Open enhanced patient services modal
                          const event = new CustomEvent('open-patient-services', { detail: patient });
                          window.dispatchEvent(event);
                        }}
                        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <Stethoscope className="h-4 w-4" />
                        <span>Services</span>
                      </button>
                      <button
                        onClick={() => setShowPrintRecordsModal(patient)}
                        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Print Records</span>
                      </button>
                      {patient.gender === 'female' && (
                        <button
                          onClick={() => {
                            const event = new CustomEvent('open-tca-calculator', { detail: patient });
                            window.dispatchEvent(event);
                          }}
                          className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                          <Heart className="h-4 w-4" />
                          <span>TCA</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const event = new CustomEvent('open-document-generator', { detail: patient });
                          window.dispatchEvent(event);
                        }}
                        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Documents</span>
                      </button>
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPatients.length === 0 && (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No patients found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Patient Modal */}
      {showAddModal && !isReviewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={newPatient.emergencyContact}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newPatient.notes}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about the patient"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Gynecologic History for Female Patients */}
              {newPatient.gender === 'female' && (
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-pink-600" />
                    Gynecologic & Obstetric History
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gravida (G)</label>
                      <input
                        type="text"
                        value={newPatient.gynecologicHistory.gravida}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          gynecologicHistory: { ...prev.gynecologicHistory, gravida: e.target.value }
                        }))}
                        placeholder="Number of pregnancies"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Para (P)</label>
                      <input
                        type="text"
                        value={newPatient.gynecologicHistory.para}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          gynecologicHistory: { ...prev.gynecologicHistory, para: e.target.value }
                        }))}
                        placeholder="e.g., 1+2 (live births + miscarriages)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Menstrual Period</label>
                      <input
                        type="date"
                        value={newPatient.gynecologicHistory.lastMenstrualPeriod}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          gynecologicHistory: { ...prev.gynecologicHistory, lastMenstrualPeriod: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contraceptive History</label>
                      <textarea
                        value={newPatient.gynecologicHistory.contraceptiveHistory}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          gynecologicHistory: { ...prev.gynecologicHistory, contraceptiveHistory: e.target.value }
                        }))}
                        placeholder="Previous contraceptive methods used"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pregnancy History</label>
                      <textarea
                        value={newPatient.gynecologicHistory.pregnancyHistory}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          gynecologicHistory: { ...prev.gynecologicHistory, pregnancyHistory: e.target.value }
                        }))}
                        placeholder="Details about previous pregnancies, complications, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={editingPatient ? handleSaveEdit : handleAddPatient}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {editingPatient ? 'Save Changes' : 'Add Patient'}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient View Modal */}
      {showPatientView && (
        <EnhancedPatientView
          patient={showPatientView}
          onClose={() => setShowPatientView(null)}
          onAddRecord={handleAddRecord}
          onSellToPatient={() => {}}
          isReviewMode={isReviewMode}
        />
      )}

      {/* Combined Sales Modal */}
      {showSalesModal && !isReviewMode && (
        <CombinedSalesModal
          patient={showSalesModal}
          onClose={() => setShowSalesModal(null)}
          onSaleComplete={handleSaleComplete}
        />
      )}

      {/* Patient Record Print Modal */}
      {showPrintRecordsModal && (
        <PatientRecordPrintModal
          patient={showPrintRecordsModal}
          onClose={() => setShowPrintRecordsModal(null)}
        />
      )}
    </div>
  );
}