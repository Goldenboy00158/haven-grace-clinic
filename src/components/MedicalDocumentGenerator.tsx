import React, { useState } from 'react';
import { FileText, Printer, Calendar, User, Stethoscope, ClipboardList, Heart, Shield, Download, Edit, Save, X, Plus } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, Medication } from '../types';
import { medications } from '../data/medications';

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'prescriptions' | 'certificates' | 'reports' | 'receipts' | 'referrals';
  fields: DocumentField[];
}

interface DocumentField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'number' | 'medication' | 'checkbox';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: string;
}

interface MedicalDocumentGeneratorProps {
  onClose: () => void;
  preselectedPatient?: Patient;
}

export default function MedicalDocumentGenerator({ onClose, preselectedPatient }: MedicalDocumentGeneratorProps) {
  const [patients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(preselectedPatient || null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [documentData, setDocumentData] = useState<Record<string, any>>({});
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showPreview, setShowPreview] = useState(false);

  const documentTemplates: DocumentTemplate[] = [
    {
      id: 'prescription',
      name: 'Prescription Sheet',
      description: 'Medical prescription with clinic letterhead',
      icon: ClipboardList,
      category: 'prescriptions',
      fields: [
        { id: 'diagnosis', label: 'Diagnosis', type: 'textarea', required: true, placeholder: 'Primary diagnosis and any secondary conditions' },
        { id: 'medications', label: 'Prescribed Medications', type: 'medication', required: true },
        { id: 'instructions', label: 'General Instructions', type: 'textarea', placeholder: 'General care instructions, lifestyle advice, etc.' },
        { id: 'followUp', label: 'Follow-up Date', type: 'date' },
        { id: 'doctorName', label: 'Doctor Name', type: 'text', required: true },
        { id: 'doctorLicense', label: 'Medical License No.', type: 'text', required: true },
        { id: 'doctorSignature', label: 'Doctor Signature', type: 'text', placeholder: 'Digital signature or name' }
      ]
    },
    {
      id: 'sick_leave',
      name: 'Sick Leave Certificate',
      description: 'Medical certificate for sick leave',
      icon: Shield,
      category: 'certificates',
      fields: [
        { id: 'employer', label: 'Employer/Institution', type: 'text', required: true },
        { id: 'diagnosis', label: 'Medical Condition', type: 'textarea', required: true, placeholder: 'Brief description of condition (maintain patient confidentiality)' },
        { id: 'startDate', label: 'Leave Start Date', type: 'date', required: true },
        { id: 'endDate', label: 'Leave End Date', type: 'date', required: true },
        { id: 'totalDays', label: 'Total Days', type: 'number', required: true },
        { id: 'restrictions', label: 'Work Restrictions', type: 'textarea', placeholder: 'Any specific work restrictions or accommodations needed' },
        { id: 'doctorName', label: 'Doctor Name', type: 'text', required: true },
        { id: 'doctorLicense', label: 'Medical License No.', type: 'text', required: true },
        { id: 'doctorSignature', label: 'Doctor Signature', type: 'text', required: true }
      ]
    },
    {
      id: 'medical_report',
      name: 'Medical Report',
      description: 'Comprehensive medical examination report',
      icon: FileText,
      category: 'reports',
      fields: [
        { id: 'purpose', label: 'Report Purpose', type: 'select', required: true, options: ['Employment', 'Insurance', 'School', 'Travel', 'Legal', 'Other'] },
        { id: 'examination', label: 'Physical Examination Findings', type: 'textarea', required: true },
        { id: 'vitalSigns', label: 'Vital Signs', type: 'textarea', placeholder: 'BP, Temp, Pulse, Weight, Height, etc.' },
        { id: 'investigations', label: 'Investigations/Tests', type: 'textarea', placeholder: 'Lab results, imaging, etc.' },
        { id: 'diagnosis', label: 'Medical Assessment', type: 'textarea', required: true },
        { id: 'recommendations', label: 'Recommendations', type: 'textarea', placeholder: 'Treatment recommendations, lifestyle advice' },
        { id: 'fitness', label: 'Fitness Assessment', type: 'select', options: ['Fit for duty', 'Fit with restrictions', 'Temporarily unfit', 'Permanently unfit'] },
        { id: 'doctorName', label: 'Doctor Name', type: 'text', required: true },
        { id: 'doctorLicense', label: 'Medical License No.', type: 'text', required: true }
      ]
    },
    {
      id: 'referral_letter',
      name: 'Referral Letter',
      description: 'Patient referral to specialist or facility',
      icon: User,
      category: 'referrals',
      fields: [
        { id: 'referTo', label: 'Refer To (Doctor/Facility)', type: 'text', required: true },
        { id: 'specialty', label: 'Specialty', type: 'select', options: ['Cardiology', 'Neurology', 'Orthopedics', 'Gynecology', 'Pediatrics', 'Surgery', 'Psychiatry', 'Dermatology', 'Other'] },
        { id: 'reason', label: 'Reason for Referral', type: 'textarea', required: true },
        { id: 'clinicalHistory', label: 'Relevant Clinical History', type: 'textarea', required: true },
        { id: 'currentTreatment', label: 'Current Treatment', type: 'textarea' },
        { id: 'urgency', label: 'Urgency', type: 'select', options: ['Routine', 'Urgent', 'Emergency'], defaultValue: 'Routine' },
        { id: 'investigations', label: 'Investigations Done', type: 'textarea' },
        { id: 'doctorName', label: 'Referring Doctor', type: 'text', required: true },
        { id: 'doctorPhone', label: 'Doctor Contact', type: 'text' }
      ]
    },
    {
      id: 'receipt',
      name: 'Service Receipt',
      description: 'Official receipt for medical services',
      icon: FileText,
      category: 'receipts',
      fields: [
        { id: 'services', label: 'Services Provided', type: 'textarea', required: true },
        { id: 'amount', label: 'Total Amount (KES)', type: 'number', required: true },
        { id: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['Cash', 'M-Pesa', 'Bank Transfer', 'Card'], required: true },
        { id: 'receiptNumber', label: 'Receipt Number', type: 'text', defaultValue: () => `RCP${Date.now()}` },
        { id: 'attendedBy', label: 'Attended By', type: 'text', required: true }
      ]
    },
    {
      id: 'fitness_certificate',
      name: 'Fitness Certificate',
      description: 'Medical fitness certificate',
      icon: Heart,
      category: 'certificates',
      fields: [
        { id: 'purpose', label: 'Certificate Purpose', type: 'select', required: true, options: ['Employment', 'Sports', 'Travel', 'School', 'Driving License', 'Other'] },
        { id: 'examination', label: 'Examination Findings', type: 'textarea', required: true },
        { id: 'fitness', label: 'Fitness Status', type: 'select', required: true, options: ['Medically Fit', 'Fit with Restrictions', 'Temporarily Unfit', 'Unfit'] },
        { id: 'restrictions', label: 'Restrictions (if any)', type: 'textarea' },
        { id: 'validUntil', label: 'Valid Until', type: 'date' },
        { id: 'doctorName', label: 'Doctor Name', type: 'text', required: true },
        { id: 'doctorLicense', label: 'Medical License No.', type: 'text', required: true }
      ]
    }
  ];

  const categories = [
    { id: 'prescriptions', name: 'Prescriptions', icon: ClipboardList, color: 'bg-blue-100 text-blue-800' },
    { id: 'certificates', name: 'Certificates', icon: Shield, color: 'bg-green-100 text-green-800' },
    { id: 'reports', name: 'Medical Reports', icon: FileText, color: 'bg-purple-100 text-purple-800' },
    { id: 'receipts', name: 'Receipts', icon: FileText, color: 'bg-orange-100 text-orange-800' },
    { id: 'referrals', name: 'Referrals', icon: User, color: 'bg-indigo-100 text-indigo-800' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredTemplates = selectedCategory 
    ? documentTemplates.filter(template => template.category === selectedCategory)
    : documentTemplates;

  const handleFieldChange = (fieldId: string, value: any) => {
    setDocumentData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const generateDocument = () => {
    if (!selectedTemplate || !selectedPatient) return;

    const clinicSettings = JSON.parse(localStorage.getItem('clinic-settings') || '{}');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = generateDocumentContent(selectedTemplate, selectedPatient, documentData, documentDate, clinicSettings);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${selectedTemplate.name} - ${selectedPatient.name}</title>
          <style>${getDocumentStyles()}</style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const generateDocumentContent = (template: DocumentTemplate, patient: Patient, data: Record<string, any>, date: string, clinicSettings: any): string => {
    let content = '';

    // Header with clinic information
    content += `
      <div class="document-header">
        <div class="clinic-info">
          <h1>${clinicSettings.clinicName || 'Haven Grace Medical Clinic'}</h1>
          <p>${clinicSettings.clinicAddress || 'Zimmerman, Nairobi'}</p>
          <p>Phone: ${clinicSettings.clinicPhone?.join(', ') || '0719307605, 0725488740'}</p>
          <p>Email: ${clinicSettings.clinicEmail || 'info@havengraceclinic.com'}</p>
        </div>
        <div class="document-date">
          <p>Date: ${new Date(date).toLocaleDateString()}</p>
        </div>
      </div>
      <hr class="header-divider">
    `;

    // Document title
    content += `<h2 class="document-title">${template.name}</h2>`;

    // Patient information
    content += `
      <div class="patient-info">
        <h3>Patient Information</h3>
        <div class="patient-details">
          <p><strong>Name:</strong> ${patient.name}</p>
          <p><strong>Age:</strong> ${patient.age} years</p>
          <p><strong>Gender:</strong> ${patient.gender}</p>
          <p><strong>Phone:</strong> ${patient.phone}</p>
          ${patient.address ? `<p><strong>Address:</strong> ${patient.address}</p>` : ''}
        </div>
      </div>
    `;

    // Document-specific content
    switch (template.id) {
      case 'prescription':
        content += generatePrescriptionContent(data);
        break;
      case 'sick_leave':
        content += generateSickLeaveContent(data);
        break;
      case 'medical_report':
        content += generateMedicalReportContent(data);
        break;
      case 'referral_letter':
        content += generateReferralContent(data);
        break;
      case 'receipt':
        content += generateReceiptContent(data);
        break;
      case 'fitness_certificate':
        content += generateFitnessContent(data);
        break;
    }

    // Footer with doctor signature
    content += `
      <div class="document-footer">
        <div class="signature-section">
          <p><strong>Doctor:</strong> ${data.doctorName || 'Dr. [Name]'}</p>
          ${data.doctorLicense ? `<p><strong>License No:</strong> ${data.doctorLicense}</p>` : ''}
          <div class="signature-line">
            <p>Signature: ${data.doctorSignature || '_________________________'}</p>
          </div>
          <p class="stamp-area">Official Stamp</p>
        </div>
      </div>
    `;

    return content;
  };

  const generatePrescriptionContent = (data: Record<string, any>): string => {
    return `
      <div class="prescription-content">
        <div class="rx-symbol">℞</div>
        
        <div class="diagnosis-section">
          <h4>Diagnosis:</h4>
          <p>${data.diagnosis || '[Diagnosis]'}</p>
        </div>

        <div class="medications-section">
          <h4>Prescribed Medications:</h4>
          <div class="medications-list">
            ${data.medications ? data.medications.map((med: any, index: number) => `
              <div class="medication-item">
                <p><strong>${index + 1}. ${med.name}</strong></p>
                <p>Dosage: ${med.dosage || '[Dosage]'}</p>
                <p>Frequency: ${med.frequency || '[Frequency]'} for ${med.duration || '[Duration]'} days</p>
                <p>Instructions: ${med.instructions || '[Instructions]'}</p>
                <p>Quantity: ${med.quantity || '[Quantity]'} tablets/capsules</p>
              </div>
            `).join('') : '<p>[No medications prescribed]</p>'}
          </div>
        </div>

        ${data.instructions ? `
          <div class="instructions-section">
            <h4>General Instructions:</h4>
            <p>${data.instructions}</p>
          </div>
        ` : ''}

        ${data.followUp ? `
          <div class="follow-up-section">
            <h4>Follow-up:</h4>
            <p>Next appointment: ${new Date(data.followUp).toLocaleDateString()}</p>
          </div>
        ` : ''}
      </div>
    `;
  };

  const generateSickLeaveContent = (data: Record<string, any>): string => {
    return `
      <div class="certificate-content">
        <div class="to-whom">
          <p><strong>To:</strong> ${data.employer || '[Employer/Institution]'}</p>
        </div>

        <div class="certificate-body">
          <p>This is to certify that <strong>${selectedPatient?.name}</strong> has been under my medical care.</p>
          
          <div class="medical-details">
            <p><strong>Medical Condition:</strong> ${data.diagnosis || '[Medical condition]'}</p>
            <p><strong>Period of Incapacity:</strong> From ${data.startDate ? new Date(data.startDate).toLocaleDateString() : '[Start Date]'} to ${data.endDate ? new Date(data.endDate).toLocaleDateString() : '[End Date]'}</p>
            <p><strong>Total Days:</strong> ${data.totalDays || '[Number]'} days</p>
          </div>

          ${data.restrictions ? `
            <div class="restrictions">
              <p><strong>Work Restrictions:</strong></p>
              <p>${data.restrictions}</p>
            </div>
          ` : ''}

          <p>The patient is advised to rest and avoid work during this period for proper recovery.</p>
        </div>
      </div>
    `;
  };

  const generateMedicalReportContent = (data: Record<string, any>): string => {
    return `
      <div class="report-content">
        <div class="report-purpose">
          <p><strong>Report Purpose:</strong> ${data.purpose || '[Purpose]'}</p>
        </div>

        <div class="examination-findings">
          <h4>Physical Examination:</h4>
          <p>${data.examination || '[Examination findings]'}</p>
        </div>

        ${data.vitalSigns ? `
          <div class="vital-signs">
            <h4>Vital Signs:</h4>
            <p>${data.vitalSigns}</p>
          </div>
        ` : ''}

        ${data.investigations ? `
          <div class="investigations">
            <h4>Investigations/Tests:</h4>
            <p>${data.investigations}</p>
          </div>
        ` : ''}

        <div class="medical-assessment">
          <h4>Medical Assessment:</h4>
          <p>${data.diagnosis || '[Medical assessment]'}</p>
        </div>

        ${data.recommendations ? `
          <div class="recommendations">
            <h4>Recommendations:</h4>
            <p>${data.recommendations}</p>
          </div>
        ` : ''}

        ${data.fitness ? `
          <div class="fitness-assessment">
            <h4>Fitness Assessment:</h4>
            <p class="fitness-status"><strong>${data.fitness}</strong></p>
          </div>
        ` : ''}
      </div>
    `;
  };

  const generateReferralContent = (data: Record<string, any>): string => {
    return `
      <div class="referral-content">
        <div class="referral-to">
          <p><strong>To:</strong> ${data.referTo || '[Doctor/Facility Name]'}</p>
          ${data.specialty ? `<p><strong>Specialty:</strong> ${data.specialty}</p>` : ''}
        </div>

        <div class="referral-body">
          <p>Dear Colleague,</p>
          
          <p>I am referring the above patient for your expert opinion and management.</p>

          <div class="referral-reason">
            <h4>Reason for Referral:</h4>
            <p>${data.reason || '[Reason for referral]'}</p>
          </div>

          <div class="clinical-history">
            <h4>Relevant Clinical History:</h4>
            <p>${data.clinicalHistory || '[Clinical history]'}</p>
          </div>

          ${data.currentTreatment ? `
            <div class="current-treatment">
              <h4>Current Treatment:</h4>
              <p>${data.currentTreatment}</p>
            </div>
          ` : ''}

          ${data.investigations ? `
            <div class="investigations">
              <h4>Investigations Done:</h4>
              <p>${data.investigations}</p>
            </div>
          ` : ''}

          ${data.urgency ? `
            <div class="urgency">
              <p><strong>Urgency:</strong> ${data.urgency}</p>
            </div>
          ` : ''}

          <p>Thank you for your assistance in the management of this patient.</p>
          
          ${data.doctorPhone ? `<p>Please feel free to contact me at ${data.doctorPhone} if you need any additional information.</p>` : ''}
        </div>
      </div>
    `;
  };

  const generateReceiptContent = (data: Record<string, any>): string => {
    return `
      <div class="receipt-content">
        <div class="receipt-header">
          <h3>OFFICIAL RECEIPT</h3>
          <p><strong>Receipt No:</strong> ${data.receiptNumber || `RCP${Date.now()}`}</p>
        </div>

        <div class="receipt-details">
          <div class="service-details">
            <h4>Services Provided:</h4>
            <p>${data.services || '[Services provided]'}</p>
          </div>

          <div class="payment-details">
            <table class="receipt-table">
              <tr>
                <td><strong>Total Amount:</strong></td>
                <td><strong>KES ${data.amount ? parseFloat(data.amount).toLocaleString() : '[Amount]'}</strong></td>
              </tr>
              <tr>
                <td>Payment Method:</td>
                <td>${data.paymentMethod || '[Payment method]'}</td>
              </tr>
              <tr>
                <td>Attended By:</td>
                <td>${data.attendedBy || '[Staff name]'}</td>
              </tr>
            </table>
          </div>

          <div class="receipt-footer">
            <p>Thank you for choosing our services!</p>
            <p><em>This is an official receipt for medical services rendered.</em></p>
          </div>
        </div>
      </div>
    `;
  };

  const generateFitnessContent = (data: Record<string, any>): string => {
    return `
      <div class="certificate-content">
        <div class="certificate-title">
          <h3>MEDICAL FITNESS CERTIFICATE</h3>
        </div>

        <div class="certificate-body">
          <p><strong>Purpose:</strong> ${data.purpose || '[Purpose]'}</p>
          
          <p>This is to certify that I have examined <strong>${selectedPatient?.name}</strong> and found the following:</p>

          <div class="examination-findings">
            <h4>Examination Findings:</h4>
            <p>${data.examination || '[Examination findings]'}</p>
          </div>

          <div class="fitness-declaration">
            <h4>Medical Fitness Status:</h4>
            <p class="fitness-status"><strong>${data.fitness || '[Fitness status]'}</strong></p>
          </div>

          ${data.restrictions ? `
            <div class="restrictions">
              <h4>Restrictions/Recommendations:</h4>
              <p>${data.restrictions}</p>
            </div>
          ` : ''}

          ${data.validUntil ? `
            <p><strong>This certificate is valid until:</strong> ${new Date(data.validUntil).toLocaleDateString()}</p>
          ` : ''}

          <p>This certificate is issued based on medical examination conducted on ${new Date(date).toLocaleDateString()}.</p>
        </div>
      </div>
    `;
  };

  const getDocumentStyles = (): string => {
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
      
      .header-divider {
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
      }
      
      .patient-details p {
        margin: 2px 0;
        font-size: 14px;
      }
      
      .prescription-content .rx-symbol {
        font-size: 48px;
        color: #2563eb;
        text-align: center;
        margin: 20px 0;
        font-weight: bold;
      }
      
      .diagnosis-section,
      .medications-section,
      .instructions-section,
      .follow-up-section {
        margin: 20px 0;
      }
      
      .diagnosis-section h4,
      .medications-section h4,
      .instructions-section h4,
      .follow-up-section h4 {
        color: #374151;
        margin: 0 0 10px 0;
        font-size: 16px;
      }
      
      .medication-item {
        margin: 15px 0;
        padding: 10px;
        border-left: 3px solid #2563eb;
        background-color: #f8f9fa;
      }
      
      .medication-item p {
        margin: 3px 0;
      }
      
      .certificate-content,
      .report-content,
      .referral-content,
      .receipt-content {
        margin: 20px 0;
      }
      
      .to-whom {
        margin: 20px 0;
      }
      
      .certificate-body,
      .referral-body {
        margin: 20px 0;
        line-height: 1.8;
      }
      
      .medical-details,
      .examination-findings,
      .vital-signs,
      .investigations,
      .medical-assessment,
      .recommendations,
      .fitness-assessment {
        margin: 15px 0;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 5px;
      }
      
      .fitness-status {
        font-size: 18px;
        color: #16a34a;
        font-weight: bold;
        text-align: center;
        padding: 10px;
        border: 2px solid #16a34a;
        border-radius: 5px;
        margin: 10px 0;
      }
      
      .receipt-header {
        text-align: center;
        margin: 20px 0;
      }
      
      .receipt-header h3 {
        color: #2563eb;
        margin: 0;
      }
      
      .receipt-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      
      .receipt-table td {
        padding: 8px;
        border-bottom: 1px solid #ddd;
      }
      
      .receipt-footer {
        text-align: center;
        margin: 20px 0;
        font-style: italic;
      }
      
      .document-footer {
        margin-top: 40px;
        page-break-inside: avoid;
      }
      
      .signature-section {
        margin-top: 30px;
      }
      
      .signature-line {
        margin: 20px 0;
      }
      
      .stamp-area {
        margin-top: 20px;
        text-align: right;
        font-style: italic;
        color: #666;
      }
      
      .certificate-title {
        text-align: center;
        margin: 20px 0;
      }
      
      .certificate-title h3 {
        color: #2563eb;
        font-size: 18px;
        letter-spacing: 2px;
      }
      
      @page {
        margin: 1in;
        size: A4;
      }
      
      h4 {
        color: #374151;
        margin: 15px 0 8px 0;
        font-size: 14px;
        font-weight: bold;
      }
      
      p {
        margin: 5px 0;
        font-size: 14px;
      }
    `;
  };

  const renderField = (field: DocumentField) => {
    switch (field.type) {
      case 'medication':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
            <MedicationSelector
              value={documentData[field.id] || []}
              onChange={(medications) => handleFieldChange(field.id, medications)}
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <textarea
              value={documentData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required={field.required}
            />
          </div>
        );
      
      case 'select':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <select
              value={documentData[field.id] || field.defaultValue || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      
      case 'date':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type="date"
              value={documentData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={field.required}
            />
          </div>
        );
      
      case 'number':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type="number"
              value={documentData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || '')}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={field.required}
            />
          </div>
        );
      
      default:
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type="text"
              value={documentData[field.id] || field.defaultValue || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={field.required}
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Medical Document Generator</h3>
              <p className="text-blue-100 text-sm mt-1">Generate professional medical documents and certificates</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Patient Selection */}
          {!selectedPatient && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Select Patient</h4>
                <div className="grid gap-3 max-h-64 overflow-y-auto">
                  {patients.map(patient => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">
                          {patient.age} years • {patient.gender} • {patient.phone}
                        </p>
                      </div>
                      <User className="h-5 w-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Document Type Selection */}
          {selectedPatient && !selectedTemplate && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">
                  Step 2: Select Document Type for {selectedPatient.name}
                </h4>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Change Patient
                </button>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Documents
                </button>
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map(template => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className="p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">{template.name}</h5>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                            categories.find(c => c.id === template.category)?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {categories.find(c => c.id === template.category)?.name || template.category}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Fill Document */}
          {selectedPatient && selectedTemplate && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">
                  Step 3: Fill {selectedTemplate.name} for {selectedPatient.name}
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setDocumentDate(new Date().toISOString().split('T')[0])}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Use Today's Date
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Change Document
                  </button>
                </div>
              </div>

              {/* Document Date */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Date</label>
                <input
                  type="date"
                  value={documentDate}
                  onChange={(e) => setDocumentDate(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can backdate this document if needed for historical records
                </p>
              </div>

              {/* Document Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                {selectedTemplate.fields.map(field => renderField(field))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-6 border-t">
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Preview Document</span>
                </button>
                <button
                  onClick={generateDocument}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Generate & Print</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedTemplate(null);
                    setDocumentData({});
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Medication Selector Component
interface MedicationSelectorProps {
  value: any[];
  onChange: (medications: any[]) => void;
}

function MedicationSelector({ value, onChange }: MedicationSelectorProps) {
  const [selectedMedications, setSelectedMedications] = useState(value || []);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: 7,
    instructions: '',
    quantity: 1
  });

  const availableMedications = medications.filter(med => med.stock > 0);

  const addMedication = () => {
    if (!newMedication.name || !newMedication.frequency) return;

    const medication = availableMedications.find(med => med.id === newMedication.name);
    if (!medication) return;

    const medData = {
      id: medication.id,
      name: medication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      duration: newMedication.duration,
      instructions: newMedication.instructions,
      quantity: newMedication.quantity
    };

    const updated = [...selectedMedications, medData];
    setSelectedMedications(updated);
    onChange(updated);

    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      duration: 7,
      instructions: '',
      quantity: 1
    });
  };

  const removeMedication = (index: number) => {
    const updated = selectedMedications.filter((_, i) => i !== index);
    setSelectedMedications(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Add Medication Form */}
      <div className="border border-gray-300 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <select
            value={newMedication.name}
            onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select medication</option>
            {availableMedications.map(med => (
              <option key={med.id} value={med.id}>{med.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={newMedication.dosage}
            onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
            placeholder="Dosage (e.g., 500mg)"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <select
            value={newMedication.frequency}
            onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Frequency</option>
            <option value="OD">OD - Once daily</option>
            <option value="BD">BD - Twice daily</option>
            <option value="TDS">TDS - Three times daily</option>
            <option value="QID">QID - Four times daily</option>
          </select>
          <input
            type="number"
            min="1"
            value={newMedication.duration}
            onChange={(e) => setNewMedication(prev => ({ ...prev, duration: parseInt(e.target.value) || 7 }))}
            placeholder="Days"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            min="1"
            value={newMedication.quantity}
            onChange={(e) => setNewMedication(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
            placeholder="Quantity"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <input
          type="text"
          value={newMedication.instructions}
          onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
          placeholder="Instructions (e.g., after meals)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={addMedication}
          disabled={!newMedication.name || !newMedication.frequency}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Selected Medications */}
      {selectedMedications.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">Selected Medications:</h5>
          {selectedMedications.map((med, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div>
                <p className="font-medium">{med.name}</p>
                <p className="text-sm text-gray-600">
                  {med.dosage} - {med.frequency} for {med.duration} days
                </p>
                <p className="text-sm text-gray-500">{med.instructions}</p>
              </div>
              <button
                onClick={() => removeMedication(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}