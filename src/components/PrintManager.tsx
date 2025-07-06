import React, { useState } from 'react';
import { Printer, FileText, Users, Package, DollarSign, Calendar, Download, Settings, Eye, Check } from 'lucide-react';

interface PrintManagerProps {
  onClose: () => void;
}

interface PrintOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'reports' | 'records' | 'documents' | 'receipts';
  dataRequired: string[];
  formats: ('pdf' | 'html' | 'csv')[];
}

export default function PrintManager({ onClose }: PrintManagerProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [printSettings, setPrintSettings] = useState({
    format: 'pdf' as 'pdf' | 'html' | 'csv',
    includeHeader: true,
    includeFooter: true,
    includeDate: true,
    orientation: 'portrait' as 'portrait' | 'landscape',
    paperSize: 'A4' as 'A4' | 'Letter' | 'A3',
    margins: 'normal' as 'normal' | 'narrow' | 'wide'
  });

  const printOptions: PrintOption[] = [
    // Reports
    {
      id: 'inventory-report',
      title: 'Inventory Report',
      description: 'Complete medication inventory with stock levels and values',
      icon: Package,
      category: 'reports',
      dataRequired: ['medications'],
      formats: ['pdf', 'html', 'csv']
    },
    {
      id: 'financial-report',
      title: 'Financial Summary',
      description: 'Revenue, expenses, and profit analysis',
      icon: DollarSign,
      category: 'reports',
      dataRequired: ['transactions', 'expenses'],
      formats: ['pdf', 'html', 'csv']
    },
    {
      id: 'patient-summary',
      title: 'Patient Summary Report',
      description: 'Overview of all patients and their visit history',
      icon: Users,
      category: 'reports',
      dataRequired: ['patients'],
      formats: ['pdf', 'html', 'csv']
    },
    {
      id: 'daily-report',
      title: 'Daily Operations Report',
      description: 'Daily transactions, expenses, and activities',
      icon: Calendar,
      category: 'reports',
      dataRequired: ['transactions', 'expenses', 'patients'],
      formats: ['pdf', 'html']
    },
    {
      id: 'stock-alerts',
      title: 'Stock Alert Report',
      description: 'Low stock and out-of-stock medications',
      icon: Package,
      category: 'reports',
      dataRequired: ['medications'],
      formats: ['pdf', 'html']
    },

    // Patient Records
    {
      id: 'patient-record',
      title: 'Individual Patient Record',
      description: 'Complete medical history for a specific patient',
      icon: FileText,
      category: 'records',
      dataRequired: ['patients'],
      formats: ['pdf', 'html']
    },
    {
      id: 'prescription',
      title: 'Prescription Form',
      description: 'Printable prescription with clinic letterhead',
      icon: FileText,
      category: 'records',
      dataRequired: ['patients', 'medications'],
      formats: ['pdf', 'html']
    },
    {
      id: 'medical-certificate',
      title: 'Medical Certificate',
      description: 'Official medical certificate template',
      icon: FileText,
      category: 'documents',
      dataRequired: ['patients'],
      formats: ['pdf', 'html']
    },

    // Business Documents
    {
      id: 'invoice',
      title: 'Invoice/Receipt',
      description: 'Professional invoice for services rendered',
      icon: FileText,
      category: 'receipts',
      dataRequired: ['transactions'],
      formats: ['pdf', 'html']
    },
    {
      id: 'expense-receipt',
      title: 'Expense Receipt',
      description: 'Receipt for recorded expenses',
      icon: DollarSign,
      category: 'receipts',
      dataRequired: ['expenses'],
      formats: ['pdf', 'html']
    },

    // Administrative
    {
      id: 'appointment-list',
      title: 'Appointment Schedule',
      description: 'Daily or weekly appointment schedule',
      icon: Calendar,
      category: 'documents',
      dataRequired: ['patients'],
      formats: ['pdf', 'html']
    },
    {
      id: 'clinic-letterhead',
      title: 'Clinic Letterhead',
      description: 'Blank letterhead for official correspondence',
      icon: FileText,
      category: 'documents',
      dataRequired: ['settings'],
      formats: ['pdf', 'html']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Documents', count: printOptions.length },
    { id: 'reports', name: 'Reports', count: printOptions.filter(o => o.category === 'reports').length },
    { id: 'records', name: 'Patient Records', count: printOptions.filter(o => o.category === 'records').length },
    { id: 'documents', name: 'Documents', count: printOptions.filter(o => o.category === 'documents').length },
    { id: 'receipts', name: 'Receipts', count: printOptions.filter(o => o.category === 'receipts').length }
  ];

  const filteredOptions = selectedCategory === 'all' 
    ? printOptions 
    : printOptions.filter(option => option.category === selectedCategory);

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handlePrint = () => {
    if (selectedOptions.length === 0) {
      alert('Please select at least one document to print');
      return;
    }

    // Generate and print selected documents
    selectedOptions.forEach(optionId => {
      const option = printOptions.find(o => o.id === optionId);
      if (option) {
        generateDocument(option);
      }
    });
  };

  const generateDocument = (option: PrintOption) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = generateDocumentContent(option);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${option.title}</title>
          <style>
            ${getPrintStyles()}
          </style>
        </head>
        <body class="${printSettings.orientation} ${printSettings.paperSize.toLowerCase()} ${printSettings.margins}">
          ${content}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const generateDocumentContent = (option: PrintOption): string => {
    const clinicSettings = JSON.parse(localStorage.getItem('clinic-settings') || '{}');
    const currentDate = new Date().toLocaleDateString();
    
    let content = '';

    // Header
    if (printSettings.includeHeader) {
      content += `
        <div class="header">
          <div class="clinic-info">
            <h1>${clinicSettings.clinicName || 'Haven Grace Medical Clinic'}</h1>
            <p>${clinicSettings.clinicAddress || 'Zimmerman, Nairobi'}</p>
            <p>Phone: ${clinicSettings.clinicPhone?.join(', ') || '0719307605, 0725488740'}</p>
            <p>Email: ${clinicSettings.clinicEmail || 'info@havengraceclinic.com'}</p>
          </div>
          ${printSettings.includeDate ? `<div class="date">Date: ${currentDate}</div>` : ''}
        </div>
        <hr class="header-divider">
      `;
    }

    // Document-specific content
    switch (option.id) {
      case 'inventory-report':
        content += generateInventoryReport();
        break;
      case 'financial-report':
        content += generateFinancialReport();
        break;
      case 'patient-summary':
        content += generatePatientSummary();
        break;
      case 'daily-report':
        content += generateDailyReport();
        break;
      case 'stock-alerts':
        content += generateStockAlerts();
        break;
      case 'clinic-letterhead':
        content += generateLetterhead();
        break;
      default:
        content += `<h2>${option.title}</h2><p>${option.description}</p>`;
    }

    // Footer
    if (printSettings.includeFooter) {
      content += `
        <div class="footer">
          <hr class="footer-divider">
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>${clinicSettings.clinicName || 'Haven Grace Medical Clinic'} - Confidential Document</p>
        </div>
      `;
    }

    return content;
  };

  const generateInventoryReport = (): string => {
    const medications = JSON.parse(localStorage.getItem('clinic-medications') || '[]');
    
    let content = `
      <h2>Inventory Report</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Medication</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price (KES)</th>
            <th>Value (KES)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    medications.forEach((med: any) => {
      const value = med.price * med.stock;
      const status = med.stock === 0 ? 'Out of Stock' : 
                    med.stock <= 5 ? 'Critical' : 
                    med.stock <= 15 ? 'Low Stock' : 'In Stock';
      
      content += `
        <tr>
          <td>${med.name}</td>
          <td>${med.category || 'N/A'}</td>
          <td>${med.stock}</td>
          <td>${med.price.toFixed(2)}</td>
          <td>${value.toFixed(2)}</td>
          <td class="status-${status.toLowerCase().replace(' ', '-')}">${status}</td>
        </tr>
      `;
    });

    const totalValue = medications.reduce((sum: number, med: any) => sum + (med.price * med.stock), 0);
    
    content += `
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="4"><strong>Total Inventory Value:</strong></td>
            <td><strong>KES ${totalValue.toFixed(2)}</strong></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    `;

    return content;
  };

  const generateFinancialReport = (): string => {
    const transactions = JSON.parse(localStorage.getItem('clinic-transactions') || '[]');
    const expenses = JSON.parse(localStorage.getItem('clinic-expenses') || '[]');
    
    const totalRevenue = transactions.reduce((sum: number, t: any) => sum + t.totalAmount, 0);
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    return `
      <h2>Financial Summary Report</h2>
      
      <div class="financial-summary">
        <div class="summary-item">
          <h3>Total Revenue</h3>
          <p class="amount positive">KES ${totalRevenue.toLocaleString()}</p>
        </div>
        <div class="summary-item">
          <h3>Total Expenses</h3>
          <p class="amount negative">KES ${totalExpenses.toLocaleString()}</p>
        </div>
        <div class="summary-item">
          <h3>Net Profit</h3>
          <p class="amount ${netProfit >= 0 ? 'positive' : 'negative'}">KES ${netProfit.toLocaleString()}</p>
        </div>
      </div>

      <h3>Recent Transactions</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Customer</th>
            <th>Amount (KES)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.slice(0, 20).map((t: any) => `
            <tr>
              <td>${new Date(t.date).toLocaleDateString()}</td>
              <td>${t.type}</td>
              <td>${t.patientName || 'General Customer'}</td>
              <td>${t.totalAmount.toFixed(2)}</td>
              <td>${t.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const generatePatientSummary = (): string => {
    const patients = JSON.parse(localStorage.getItem('clinic-patients') || '[]');
    
    return `
      <h2>Patient Summary Report</h2>
      <p>Total Patients: ${patients.length}</p>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Last Visit</th>
            <th>Records</th>
          </tr>
        </thead>
        <tbody>
          ${patients.map((p: any) => `
            <tr>
              <td>${p.name}</td>
              <td>${p.age}</td>
              <td>${p.gender}</td>
              <td>${p.phone}</td>
              <td>${p.medicalHistory.length > 0 ? new Date(p.medicalHistory[0].date).toLocaleDateString() : 'Never'}</td>
              <td>${p.medicalHistory.length}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const generateDailyReport = (): string => {
    const today = new Date().toDateString();
    const transactions = JSON.parse(localStorage.getItem('clinic-transactions') || '[]');
    const expenses = JSON.parse(localStorage.getItem('clinic-expenses') || '[]');
    
    const todayTransactions = transactions.filter((t: any) => new Date(t.date).toDateString() === today);
    const todayExpenses = expenses.filter((e: any) => new Date(e.date).toDateString() === today);
    
    const dailyRevenue = todayTransactions.reduce((sum: number, t: any) => sum + t.totalAmount, 0);
    const dailyExpenseTotal = todayExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);

    return `
      <h2>Daily Operations Report - ${new Date().toLocaleDateString()}</h2>
      
      <div class="daily-summary">
        <div class="summary-section">
          <h3>Financial Summary</h3>
          <p>Revenue: KES ${dailyRevenue.toLocaleString()}</p>
          <p>Expenses: KES ${dailyExpenseTotal.toLocaleString()}</p>
          <p>Net: KES ${(dailyRevenue - dailyExpenseTotal).toLocaleString()}</p>
        </div>
        
        <div class="summary-section">
          <h3>Activity Summary</h3>
          <p>Transactions: ${todayTransactions.length}</p>
          <p>Expense Records: ${todayExpenses.length}</p>
        </div>
      </div>

      <h3>Today's Transactions</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Amount (KES)</th>
          </tr>
        </thead>
        <tbody>
          ${todayTransactions.map((t: any) => `
            <tr>
              <td>${new Date(t.date).toLocaleTimeString()}</td>
              <td>${t.patientName || 'General Customer'}</td>
              <td>${t.items.length}</td>
              <td>${t.totalAmount.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const generateStockAlerts = (): string => {
    const medications = JSON.parse(localStorage.getItem('clinic-medications') || '[]');
    const lowStock = medications.filter((m: any) => m.stock <= 15 && m.stock > 0);
    const outOfStock = medications.filter((m: any) => m.stock === 0);
    const critical = medications.filter((m: any) => m.stock <= 5 && m.stock > 0);

    return `
      <h2>Stock Alert Report</h2>
      
      <div class="alert-summary">
        <div class="alert-item critical">
          <h3>Critical Stock (≤5 units)</h3>
          <p class="count">${critical.length} items</p>
        </div>
        <div class="alert-item low">
          <h3>Low Stock (≤15 units)</h3>
          <p class="count">${lowStock.length} items</p>
        </div>
        <div class="alert-item out">
          <h3>Out of Stock</h3>
          <p class="count">${outOfStock.length} items</p>
        </div>
      </div>

      ${critical.length > 0 ? `
        <h3>Critical Stock Items</h3>
        <table class="data-table">
          <thead>
            <tr><th>Medication</th><th>Current Stock</th><th>Category</th><th>Action Required</th></tr>
          </thead>
          <tbody>
            ${critical.map((m: any) => `
              <tr class="critical-row">
                <td>${m.name}</td>
                <td>${m.stock}</td>
                <td>${m.category || 'N/A'}</td>
                <td>Immediate Restocking</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}

      ${outOfStock.length > 0 ? `
        <h3>Out of Stock Items</h3>
        <table class="data-table">
          <thead>
            <tr><th>Medication</th><th>Category</th><th>Last Price</th><th>Action Required</th></tr>
          </thead>
          <tbody>
            ${outOfStock.map((m: any) => `
              <tr class="out-of-stock-row">
                <td>${m.name}</td>
                <td>${m.category || 'N/A'}</td>
                <td>KES ${m.price.toFixed(2)}</td>
                <td>Urgent Restocking</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
    `;
  };

  const generateLetterhead = (): string => {
    const clinicSettings = JSON.parse(localStorage.getItem('clinic-settings') || '{}');
    
    return `
      <div class="letterhead">
        <div class="letterhead-header">
          <h1>${clinicSettings.clinicName || 'Haven Grace Medical Clinic'}</h1>
          <div class="contact-info">
            <p>${clinicSettings.clinicAddress || 'Zimmerman, Nairobi'}</p>
            <p>Phone: ${clinicSettings.clinicPhone?.join(', ') || '0719307605, 0725488740'}</p>
            <p>Email: ${clinicSettings.clinicEmail || 'info@havengraceclinic.com'}</p>
          </div>
        </div>
        <hr class="letterhead-divider">
        
        <div class="letterhead-content">
          <p>Date: _________________</p>
          <br><br>
          <p>To Whom It May Concern:</p>
          <br><br><br><br><br><br><br><br><br><br>
          <p>Sincerely,</p>
          <br><br><br>
          <p>_________________________</p>
          <p>Doctor's Name</p>
          <p>Medical License No: ___________</p>
        </div>
      </div>
    `;
  };

  const getPrintStyles = (): string => {
    return `
      @media print {
        body { margin: 0; }
        .no-print { display: none !important; }
      }
      
      body {
        font-family: Arial, sans-serif;
        line-height: 1.4;
        color: #333;
        margin: 0;
        padding: 20px;
      }
      
      .portrait { }
      .landscape { }
      
      .a4 { max-width: 210mm; }
      .letter { max-width: 8.5in; }
      .a3 { max-width: 297mm; }
      
      .normal { padding: 20px; }
      .narrow { padding: 10px; }
      .wide { padding: 30px; }
      
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
      }
      
      .clinic-info h1 {
        margin: 0 0 10px 0;
        color: #2563eb;
        font-size: 24px;
      }
      
      .clinic-info p {
        margin: 2px 0;
        font-size: 14px;
      }
      
      .date {
        font-size: 14px;
        color: #666;
      }
      
      .header-divider, .footer-divider {
        border: none;
        border-top: 2px solid #2563eb;
        margin: 20px 0;
      }
      
      .data-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 12px;
      }
      
      .data-table th,
      .data-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      
      .data-table th {
        background-color: #f8f9fa;
        font-weight: bold;
      }
      
      .data-table .total-row {
        background-color: #f0f9ff;
        font-weight: bold;
      }
      
      .financial-summary {
        display: flex;
        justify-content: space-around;
        margin: 20px 0;
        background-color: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
      }
      
      .summary-item {
        text-align: center;
      }
      
      .summary-item h3 {
        margin: 0 0 10px 0;
        font-size: 16px;
        color: #666;
      }
      
      .amount {
        font-size: 24px;
        font-weight: bold;
        margin: 0;
      }
      
      .amount.positive { color: #16a34a; }
      .amount.negative { color: #dc2626; }
      
      .daily-summary {
        display: flex;
        gap: 40px;
        margin: 20px 0;
      }
      
      .summary-section h3 {
        margin: 0 0 10px 0;
        color: #2563eb;
      }
      
      .summary-section p {
        margin: 5px 0;
      }
      
      .alert-summary {
        display: flex;
        justify-content: space-around;
        margin: 20px 0;
      }
      
      .alert-item {
        text-align: center;
        padding: 15px;
        border-radius: 8px;
        min-width: 120px;
      }
      
      .alert-item.critical {
        background-color: #fef2f2;
        border: 2px solid #dc2626;
      }
      
      .alert-item.low {
        background-color: #fffbeb;
        border: 2px solid #f59e0b;
      }
      
      .alert-item.out {
        background-color: #f3f4f6;
        border: 2px solid #6b7280;
      }
      
      .alert-item h3 {
        margin: 0 0 10px 0;
        font-size: 14px;
      }
      
      .alert-item .count {
        font-size: 24px;
        font-weight: bold;
        margin: 0;
      }
      
      .critical-row { background-color: #fef2f2; }
      .out-of-stock-row { background-color: #f3f4f6; }
      
      .status-out-of-stock { color: #dc2626; font-weight: bold; }
      .status-critical { color: #f59e0b; font-weight: bold; }
      .status-low-stock { color: #f59e0b; }
      .status-in-stock { color: #16a34a; }
      
      .letterhead {
        min-height: 80vh;
      }
      
      .letterhead-header {
        text-align: center;
        margin-bottom: 30px;
      }
      
      .letterhead-header h1 {
        color: #2563eb;
        margin: 0 0 15px 0;
        font-size: 28px;
      }
      
      .contact-info p {
        margin: 3px 0;
        font-size: 14px;
      }
      
      .letterhead-divider {
        border: none;
        border-top: 3px solid #2563eb;
        margin: 30px 0;
      }
      
      .letterhead-content {
        margin-top: 40px;
        line-height: 2;
      }
      
      .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 12px;
        color: #666;
      }
      
      h2 {
        color: #2563eb;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 10px;
        margin: 30px 0 20px 0;
      }
      
      h3 {
        color: #374151;
        margin: 25px 0 15px 0;
      }
      
      @page {
        margin: 1in;
      }
    `;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Printer className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-semibold">Print Manager</h3>
                <p className="text-blue-100">Generate and print professional documents</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Document Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Print Options */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Available Documents</h4>
            <div className="grid md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
              {filteredOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedOptions.includes(option.id);
                
                return (
                  <div
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-900">{option.title}</h5>
                          {isSelected && <Check className="h-5 w-5 text-blue-600" />}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {option.category}
                          </span>
                          <div className="flex space-x-1">
                            {option.formats.map(format => (
                              <span key={format} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {format.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Print Settings */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Print Settings
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select
                  value={printSettings.format}
                  onChange={(e) => setPrintSettings(prev => ({ ...prev, format: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pdf">PDF</option>
                  <option value="html">HTML (Print Preview)</option>
                  <option value="csv">CSV (Data Only)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
                <select
                  value={printSettings.orientation}
                  onChange={(e) => setPrintSettings(prev => ({ ...prev, orientation: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paper Size</label>
                <select
                  value={printSettings.paperSize}
                  onChange={(e) => setPrintSettings(prev => ({ ...prev, paperSize: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                  <option value="A3">A3</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={printSettings.includeHeader}
                  onChange={(e) => setPrintSettings(prev => ({ ...prev, includeHeader: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include Header</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={printSettings.includeFooter}
                  onChange={(e) => setPrintSettings(prev => ({ ...prev, includeFooter: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include Footer</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={printSettings.includeDate}
                  onChange={(e) => setPrintSettings(prev => ({ ...prev, includeDate: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include Date</span>
              </label>
            </div>
          </div>

          {/* Selected Documents Summary */}
          {selectedOptions.length > 0 && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Selected Documents ({selectedOptions.length})</h5>
              <div className="flex flex-wrap gap-2">
                {selectedOptions.map(optionId => {
                  const option = printOptions.find(o => o.id === optionId);
                  return option ? (
                    <span key={optionId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {option.title}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              disabled={selectedOptions.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print Selected Documents ({selectedOptions.length})</span>
            </button>
            
            <button
              onClick={() => setSelectedOptions(filteredOptions.map(o => o.id))}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Select All
            </button>
            
            <button
              onClick={() => setSelectedOptions([])}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear All
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