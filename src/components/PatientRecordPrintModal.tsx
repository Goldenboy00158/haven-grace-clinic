import React, { useState } from 'react';
import { Printer, FileText, X, Calendar, User, Activity, Download, Eye } from 'lucide-react';
import { Patient, MedicalRecord } from '../types';
import VitalSignsDisplay from './VitalSignsDisplay';

interface PatientRecordPrintModalProps {
  patient: Patient;
  onClose: () => void;
}

export default function PatientRecordPrintModal({ patient, onClose }: PatientRecordPrintModalProps) {
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [includeVitalSigns, setIncludeVitalSigns] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);
  const [includePatientInfo, setIncludePatientInfo] = useState(true);
  const [printFormat, setPrintFormat] = useState<'detailed' | 'summary'>('detailed');

  const toggleRecord = (recordId: string) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const selectAllRecords = () => {
    setSelectedRecords(patient.medicalHistory.map(record => record.id));
  };

  const clearSelection = () => {
    setSelectedRecords([]);
  };

  const generatePrintContent = () => {
    const clinicSettings = JSON.parse(localStorage.getItem('clinic-settings') || '{}');
    const recordsToPrint = patient.medicalHistory.filter(record => 
      selectedRecords.includes(record.id)
    );

    let content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medical Records - ${patient.name}</title>
          <style>${getPrintStyles()}</style>
        </head>
        <body>
          <div class="document-header">
            <div class="clinic-info">
              <h1>${clinicSettings.clinicName || 'Haven Grace Medical Clinic'}</h1>
              <p>${clinicSettings.clinicAddress || 'Zimmerman, Nairobi'}</p>
              <p>Phone: ${clinicSettings.clinicPhone?.join(', ') || '0719307605, 0725488740'}</p>
              <p>Email: ${clinicSettings.clinicEmail || 'info@havengraceclinic.com'}</p>
            </div>
            <div class="document-date">
              <p>Printed: ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <hr class="header-divider">
          
          <h2 class="document-title">MEDICAL RECORDS</h2>
    `;

    // Patient Information
    if (includePatientInfo) {
      content += `
        <div class="patient-info">
          <h3>Patient Information</h3>
          <div class="patient-details">
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Age:</strong> ${patient.age} years</p>
            <p><strong>Gender:</strong> ${patient.gender}</p>
            <p><strong>Phone:</strong> ${patient.phone}</p>
            ${patient.address ? `<p><strong>Address:</strong> ${patient.address}</p>` : ''}
            ${patient.emergencyContact ? `<p><strong>Emergency Contact:</strong> ${patient.emergencyContact}</p>` : ''}
          </div>
          
          ${patient.gynecologicHistory ? `
            <div class="gynecologic-history">
              <h4>Gynecologic & Obstetric History</h4>
              <p><strong>Gravida:</strong> ${patient.gynecologicHistory.gravida || 'N/A'}</p>
              <p><strong>Para:</strong> ${patient.gynecologicHistory.para || 'N/A'}</p>
              <p><strong>LMP:</strong> ${patient.gynecologicHistory.lastMenstrualPeriod ? new Date(patient.gynecologicHistory.lastMenstrualPeriod).toLocaleDateString() : 'N/A'}</p>
              ${patient.gynecologicHistory.contraceptiveHistory ? `<p><strong>Contraceptive History:</strong> ${patient.gynecologicHistory.contraceptiveHistory}</p>` : ''}
              ${patient.gynecologicHistory.pregnancyHistory ? `<p><strong>Pregnancy History:</strong> ${patient.gynecologicHistory.pregnancyHistory}</p>` : ''}
            </div>
          ` : ''}
        </div>
      `;
    }

    // Medical Records
    content += `<div class="records-section">`;
    
    if (printFormat === 'summary') {
      content += `
        <h3>Medical Records Summary</h3>
        <table class="summary-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Diagnosis</th>
              <th>Treatment</th>
              <th>Doctor</th>
            </tr>
          </thead>
          <tbody>
            ${recordsToPrint.map(record => `
              <tr>
                <td>${new Date(record.date).toLocaleDateString()}</td>
                <td>${record.diagnosis}</td>
                <td>${record.treatment}</td>
                <td>Dr. ${record.doctorName}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      recordsToPrint.forEach((record, index) => {
        content += `
          <div class="medical-record">
            <div class="record-header">
              <h4>Visit ${index + 1} - ${new Date(record.date).toLocaleDateString()}</h4>
              <p class="doctor-name">Dr. ${record.doctorName}</p>
            </div>
            
            <div class="record-content">
              ${record.chiefComplaint ? `
                <div class="record-section">
                  <h5>Chief Complaint:</h5>
                  <p>${record.chiefComplaint}</p>
                </div>
              ` : ''}
              
              ${record.historyOfPresentIllness ? `
                <div class="record-section">
                  <h5>History of Present Illness:</h5>
                  <p>${record.historyOfPresentIllness}</p>
                </div>
              ` : ''}
              
              <div class="record-section">
                <h5>Symptoms:</h5>
                <p>${record.symptoms}</p>
              </div>
              
              <div class="record-section">
                <h5>Diagnosis:</h5>
                <p>${record.diagnosis}</p>
              </div>
              
              <div class="record-section">
                <h5>Treatment:</h5>
                <p>${record.treatment}</p>
              </div>
              
              ${includeVitalSigns && record.vitalSigns && Object.keys(record.vitalSigns).length > 0 ? `
                <div class="record-section">
                  <h5>Vital Signs:</h5>
                  <div class="vital-signs-grid">
                    ${record.vitalSigns.bloodPressure ? `<p><strong>BP:</strong> ${record.vitalSigns.bloodPressure} mmHg</p>` : ''}
                    ${record.vitalSigns.temperature ? `<p><strong>Temp:</strong> ${record.vitalSigns.temperature}°C</p>` : ''}
                    ${record.vitalSigns.pulse ? `<p><strong>Pulse:</strong> ${record.vitalSigns.pulse} bpm</p>` : ''}
                    ${record.vitalSigns.weight ? `<p><strong>Weight:</strong> ${record.vitalSigns.weight} kg</p>` : ''}
                    ${record.vitalSigns.height ? `<p><strong>Height:</strong> ${record.vitalSigns.height} cm</p>` : ''}
                    ${record.vitalSigns.respiratoryRate ? `<p><strong>RR:</strong> ${record.vitalSigns.respiratoryRate}/min</p>` : ''}
                    ${record.vitalSigns.oxygenSaturation ? `<p><strong>O2 Sat:</strong> ${record.vitalSigns.oxygenSaturation}%</p>` : ''}
                  </div>
                </div>
              ` : ''}
              
              ${includeMedications && record.medications.length > 0 ? `
                <div class="record-section">
                  <h5>Prescribed Medications:</h5>
                  <div class="medications-list">
                    ${record.medications.map((med, medIndex) => `
                      <div class="medication-item">
                        <p><strong>${medIndex + 1}. ${med.medicationName}</strong></p>
                        <p>Dosage: ${med.dosage} - ${med.frequency} for ${med.duration} days</p>
                        <p>Instructions: ${med.instructions}</p>
                        <p>Quantity: ${med.quantity} tablets/capsules - KES ${med.totalCost}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              
              ${record.notes ? `
                <div class="record-section">
                  <h5>Additional Notes:</h5>
                  <p>${record.notes}</p>
                </div>
              ` : ''}
              
              ${record.followUpDate ? `
                <div class="record-section">
                  <h5>Follow-up:</h5>
                  <p>${new Date(record.followUpDate).toLocaleDateString()}</p>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      });
    }
    
    content += `
        </div>
        
        <div class="document-footer">
          <hr class="footer-divider">
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>${clinicSettings.clinicName || 'Haven Grace Medical Clinic'} - Confidential Medical Records</p>
        </div>
      </body>
      </html>
    `;

    return content;
  };

  const handlePrint = () => {
    if (selectedRecords.length === 0) {
      alert('Please select at least one medical record to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = generatePrintContent();
    printWindow.document.write(content);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const getPrintStyles = () => {
    return `
      @media print {
        body { margin: 0; }
        .no-print { display: none !important; }
      }
      
      body {
        font-family: 'Times New Roman', serif;
        line-height: 1.6;
        color: #000;
        margin: 0;
        padding: 20px;
        background: white;
      }
      
      .document-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
      }
      
      .clinic-info h1 {
        margin: 0 0 10px 0;
        color: #2563eb;
        font-size: 24px;
        font-weight: bold;
      }
      
      .clinic-info p {
        margin: 2px 0;
        font-size: 14px;
      }
      
      .document-date {
        text-align: right;
        font-size: 14px;
      }
      
      .header-divider, .footer-divider {
        border: none;
        border-top: 2px solid #2563eb;
        margin: 20px 0;
      }
      
      .document-title {
        text-align: center;
        color: #2563eb;
        font-size: 20px;
        margin: 20px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .patient-info {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
      }
      
      .patient-info h3 {
        margin: 0 0 10px 0;
        color: #374151;
        font-size: 16px;
      }
      
      .patient-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5px;
        margin-bottom: 15px;
      }
      
      .patient-details p {
        margin: 2px 0;
        font-size: 14px;
      }
      
      .gynecologic-history {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #ddd;
      }
      
      .gynecologic-history h4 {
        margin: 0 0 10px 0;
        color: #374151;
        font-size: 14px;
      }
      
      .medical-record {
        margin: 30px 0;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        page-break-inside: avoid;
      }
      
      .record-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
      }
      
      .record-header h4 {
        margin: 0;
        color: #2563eb;
        font-size: 16px;
      }
      
      .doctor-name {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
      
      .record-section {
        margin: 15px 0;
      }
      
      .record-section h5 {
        margin: 0 0 5px 0;
        color: #374151;
        font-size: 14px;
        font-weight: bold;
      }
      
      .record-section p {
        margin: 5px 0;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .vital-signs-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px;
        margin: 10px 0;
      }
      
      .vital-signs-grid p {
        margin: 2px 0;
        font-size: 12px;
      }
      
      .medications-list {
        margin: 10px 0;
      }
      
      .medication-item {
        margin: 10px 0;
        padding: 10px;
        background-color: #f8f9fa;
        border-left: 3px solid #2563eb;
      }
      
      .medication-item p {
        margin: 3px 0;
        font-size: 13px;
      }
      
      .summary-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      
      .summary-table th,
      .summary-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
        font-size: 12px;
      }
      
      .summary-table th {
        background-color: #f8f9fa;
        font-weight: bold;
      }
      
      .document-footer {
        margin-top: 40px;
        text-align: center;
        font-size: 12px;
        color: #666;
      }
      
      @page {
        margin: 1in;
        size: A4;
      }
    `;
  };

  const handlePrintPreview = () => {
    if (selectedRecords.length === 0) {
      alert('Please select at least one medical record to preview');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = generatePrintContent();
    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Printer className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-semibold">Print Medical Records</h3>
                <p className="text-blue-100 text-sm">Patient: {patient.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Print Options */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Print Options</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Print Format</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="printFormat"
                      value="detailed"
                      checked={printFormat === 'detailed'}
                      onChange={(e) => setPrintFormat(e.target.value as any)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Detailed Records</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="printFormat"
                      value="summary"
                      checked={printFormat === 'summary'}
                      onChange={(e) => setPrintFormat(e.target.value as any)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Summary Table</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Include</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includePatientInfo}
                      onChange={(e) => setIncludePatientInfo(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Patient Information</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeVitalSigns}
                      onChange={(e) => setIncludeVitalSigns(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Vital Signs</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeMedications}
                      onChange={(e) => setIncludeMedications(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Prescribed Medications</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Record Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">
                Select Medical Records ({patient.medicalHistory.length} total)
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={selectAllRecords}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={clearSelection}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {patient.medicalHistory.map((record) => (
                <div
                  key={record.id}
                  onClick={() => toggleRecord(record.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRecords.includes(record.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => toggleRecord(record.id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-600">Dr. {record.doctorName}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Diagnosis:</strong> {record.diagnosis}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Treatment:</strong> {record.treatment.substring(0, 100)}
                        {record.treatment.length > 100 ? '...' : ''}
                      </p>
                      {record.medications.length > 0 && (
                        <p className="text-xs text-blue-600 mt-1">
                          {record.medications.length} medication(s) prescribed
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {patient.medicalHistory.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No medical records available for this patient.</p>
              </div>
            )}
          </div>

          {/* Selected Records Summary */}
          {selectedRecords.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-medium text-green-900 mb-2">
                Selected Records ({selectedRecords.length})
              </h5>
              <p className="text-sm text-green-800">
                Ready to print {selectedRecords.length} medical record(s) for {patient.name}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handlePrintPreview}
              disabled={selectedRecords.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={selectedRecords.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print Selected Records ({selectedRecords.length})</span>
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}