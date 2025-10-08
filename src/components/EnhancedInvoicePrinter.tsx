import React, { useState, useMemo } from 'react';
import { Printer, Calendar, User, DollarSign, Edit, Save, X, Search, FileText } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Transaction, Patient, Medication } from '../types';

interface EnhancedInvoicePrinterProps {
  onClose: () => void;
  preselectedTransaction?: Transaction;
}

export default function EnhancedInvoicePrinter({ onClose, preselectedTransaction }: EnhancedInvoicePrinterProps) {
  const [transactions] = useLocalStorage<Transaction[]>('clinic-transactions', []);
  const [patients] = useLocalStorage<Patient[]>('clinic-patients', []);
  const [medications] = useLocalStorage<Medication[]>('clinic-medications', []);
  const [clinicSettings] = useLocalStorage<any>('clinic-settings', {});

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(preselectedTransaction || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Editable fields
  const [invoiceDate, setInvoiceDate] = useState(
    preselectedTransaction?.date || new Date().toISOString().split('T')[0]
  );
  const [invoiceTime, setInvoiceTime] = useState(
    preselectedTransaction ? new Date(preselectedTransaction.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  );
  const [doctorName, setDoctorName] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [printType, setPrintType] = useState<'invoice' | 'receipt'>('invoice');

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch =
        t.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(t.date).toLocaleDateString().includes(searchTerm);
      return matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm]);

  const patient = selectedTransaction?.patientId
    ? patients.find(p => p.id === selectedTransaction.patientId)
    : null;

  const calculateTotal = () => {
    if (!selectedTransaction) return 0;
    return selectedTransaction.totalAmount - discountAmount;
  };

  const handlePrint = () => {
    if (!selectedTransaction) {
      alert('Please select a transaction');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = generateInvoiceContent();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${printType === 'invoice' ? 'Invoice' : 'Receipt'} - ${selectedTransaction.id}</title>
          <style>
            ${getPrintStyles()}
          </style>
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

  const generateInvoiceContent = (): string => {
    if (!selectedTransaction) return '';

    const finalTotal = calculateTotal();
    const invoiceDateTime = `${invoiceDate} ${invoiceTime}`;

    return `
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <div class="clinic-info">
            <h1>${clinicSettings.clinicName || 'Haven Grace Medical Clinic'}</h1>
            <p>${clinicSettings.clinicAddress || 'Zimmerman, Nairobi'}</p>
            <p>Tel: ${Array.isArray(clinicSettings.clinicPhone) ? clinicSettings.clinicPhone.join(', ') : '0719307605, 0725488740'}</p>
            <p>Email: ${clinicSettings.clinicEmail || 'info@havengraceclinic.com'}</p>
          </div>
          <div class="invoice-meta">
            <h2>${printType === 'invoice' ? 'INVOICE' : 'RECEIPT'}</h2>
            <p><strong>${printType === 'invoice' ? 'Invoice' : 'Receipt'} #:</strong> ${selectedTransaction.id}</p>
            <p><strong>Date:</strong> ${new Date(invoiceDateTime).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${invoiceTime}</p>
          </div>
        </div>

        <hr class="divider">

        <!-- Patient/Customer Info -->
        <div class="customer-section">
          <h3>${printType === 'invoice' ? 'Bill To:' : 'Received From:'}</h3>
          ${patient ? `
            <p><strong>Patient Name:</strong> ${patient.name}</p>
            <p><strong>Patient ID:</strong> ${patient.id}</p>
            <p><strong>Phone:</strong> ${patient.phone}</p>
            <p><strong>Age:</strong> ${patient.age} years | <strong>Gender:</strong> ${patient.gender}</p>
            ${patient.address ? `<p><strong>Address:</strong> ${patient.address}</p>` : ''}
          ` : `
            <p><strong>Customer:</strong> ${selectedTransaction.patientName || 'General Customer'}</p>
            <p><strong>Transaction Type:</strong> General Sale</p>
          `}
        </div>

        <hr class="divider">

        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Quantity</th>
              <th>Unit Price (KES)</th>
              <th>Total (KES)</th>
            </tr>
          </thead>
          <tbody>
            ${selectedTransaction.items.map(item => `
              <tr>
                <td>
                  <strong>${item.medicationName}</strong>
                  ${item.dosage ? `<br><small>Dosage: ${item.dosage}</small>` : ''}
                  ${item.frequency ? `<br><small>Frequency: ${item.frequency}</small>` : ''}
                  ${item.duration ? `<br><small>Duration: ${item.duration} days</small>` : ''}
                  ${item.instructions ? `<br><small>Instructions: ${item.instructions}</small>` : ''}
                </td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">${item.price.toFixed(2)}</td>
                <td class="text-right">${item.totalCost.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-section">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>KES ${selectedTransaction.totalAmount.toFixed(2)}</span>
          </div>
          ${showDiscount && discountAmount > 0 ? `
            <div class="totals-row">
              <span>Discount:</span>
              <span class="discount">- KES ${discountAmount.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="totals-row total">
            <span><strong>Total Amount:</strong></span>
            <span><strong>KES ${finalTotal.toFixed(2)}</strong></span>
          </div>
          <div class="totals-row">
            <span>Payment Method:</span>
            <span class="payment-method">${selectedTransaction.paymentMethod.toUpperCase()}</span>
          </div>
          <div class="totals-row">
            <span>Status:</span>
            <span class="status-${selectedTransaction.status}">${selectedTransaction.status.toUpperCase()}</span>
          </div>
        </div>

        ${additionalNotes ? `
          <div class="notes-section">
            <h4>Additional Notes:</h4>
            <p>${additionalNotes}</p>
          </div>
        ` : ''}

        ${doctorName ? `
          <div class="doctor-section">
            <p><strong>Attended by:</strong> ${doctorName}</p>
          </div>
        ` : ''}

        <!-- Footer -->
        <div class="footer">
          <hr class="divider">
          <p class="thank-you">Thank you for choosing ${clinicSettings.clinicName || 'Haven Grace Medical Clinic'}</p>
          <p class="disclaimer">This ${printType === 'invoice' ? 'invoice' : 'receipt'} was generated on ${new Date().toLocaleString()}</p>
          ${printType === 'receipt' ? '<p class="paid-stamp">PAID</p>' : ''}
        </div>
      </div>
    `;
  };

  const getPrintStyles = (): string => {
    return `
      @media print {
        body { margin: 0; padding: 0; }
        .no-print { display: none !important; }
      }

      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }

      .invoice-container {
        border: 2px solid #2563eb;
        padding: 30px;
        background: white;
      }

      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
      }

      .clinic-info h1 {
        color: #2563eb;
        margin: 0 0 10px 0;
        font-size: 24px;
      }

      .clinic-info p {
        margin: 3px 0;
        font-size: 14px;
      }

      .invoice-meta {
        text-align: right;
      }

      .invoice-meta h2 {
        color: #2563eb;
        margin: 0 0 10px 0;
        font-size: 28px;
      }

      .invoice-meta p {
        margin: 5px 0;
        font-size: 14px;
      }

      .divider {
        border: none;
        border-top: 2px solid #2563eb;
        margin: 20px 0;
      }

      .customer-section {
        margin: 20px 0;
        background: #f8f9fa;
        padding: 15px;
        border-radius: 5px;
      }

      .customer-section h3 {
        color: #2563eb;
        margin: 0 0 10px 0;
        font-size: 16px;
      }

      .customer-section p {
        margin: 5px 0;
        font-size: 14px;
      }

      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }

      .items-table th,
      .items-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
      }

      .items-table th {
        background-color: #2563eb;
        color: white;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 12px;
      }

      .items-table td {
        font-size: 14px;
      }

      .items-table small {
        color: #666;
        font-size: 12px;
      }

      .text-center { text-align: center; }
      .text-right { text-align: right; }

      .totals-section {
        margin-left: auto;
        width: 300px;
        margin-top: 20px;
      }

      .totals-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 15px;
        font-size: 14px;
      }

      .totals-row.total {
        background: #2563eb;
        color: white;
        font-size: 18px;
        margin-top: 5px;
      }

      .discount {
        color: #dc2626;
      }

      .payment-method {
        text-transform: uppercase;
        font-weight: bold;
        color: #2563eb;
      }

      .status-completed { color: #16a34a; font-weight: bold; }
      .status-confirmed { color: #2563eb; font-weight: bold; }
      .status-pending { color: #f59e0b; font-weight: bold; }

      .notes-section {
        margin: 20px 0;
        padding: 15px;
        background: #fffbeb;
        border-left: 4px solid #f59e0b;
      }

      .notes-section h4 {
        margin: 0 0 10px 0;
        color: #92400e;
      }

      .doctor-section {
        margin: 20px 0;
        font-size: 14px;
      }

      .footer {
        margin-top: 40px;
        text-align: center;
      }

      .thank-you {
        font-size: 16px;
        font-weight: bold;
        color: #2563eb;
        margin: 10px 0;
      }

      .disclaimer {
        font-size: 12px;
        color: #666;
      }

      .paid-stamp {
        display: inline-block;
        padding: 10px 30px;
        border: 3px solid #16a34a;
        color: #16a34a;
        font-size: 24px;
        font-weight: bold;
        transform: rotate(-15deg);
        margin-top: 20px;
      }

      @page {
        margin: 0.5in;
      }
    `;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto my-4">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Printer className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-semibold">Enhanced Invoice/Receipt Printer</h3>
                <p className="text-blue-100 text-sm">Print professional invoices with backdating and editing</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Panel - Transaction Selection */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Transaction</h4>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient name, ID, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>

              {/* Transactions List */}
              <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                {filteredTransactions.map((transaction) => {
                  const txPatient = transaction.patientId
                    ? patients.find(p => p.id === transaction.patientId)
                    : null;

                  return (
                    <div
                      key={transaction.id}
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setInvoiceDate(transaction.date.split('T')[0]);
                        setInvoiceTime(new Date(transaction.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                      }}
                      className={`p-4 border-b cursor-pointer transition-colors ${
                        selectedTransaction?.id === transaction.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {txPatient?.name || transaction.patientName || 'General Customer'}
                          </p>
                          <p className="text-sm text-gray-600">ID: {transaction.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.date).toLocaleDateString()} at {new Date(transaction.date).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            KES {transaction.totalAmount.toFixed(2)}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredTransactions.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No transactions found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Print Settings & Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Print Settings</h4>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                    editMode
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {editMode ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  <span>{editMode ? 'Save' : 'Edit'}</span>
                </button>
              </div>

              {selectedTransaction ? (
                <div className="space-y-4">
                  {/* Document Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPrintType('invoice')}
                        className={`p-3 border-2 rounded-lg font-medium transition-all ${
                          printType === 'invoice'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        Invoice
                      </button>
                      <button
                        onClick={() => setPrintType('receipt')}
                        className={`p-3 border-2 rounded-lg font-medium transition-all ${
                          printType === 'receipt'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        Receipt
                      </button>
                    </div>
                  </div>

                  {/* Date & Time (Backdating) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Invoice Date
                      </label>
                      <input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        disabled={!editMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Invoice Time
                      </label>
                      <input
                        type="time"
                        value={invoiceTime}
                        onChange={(e) => setInvoiceTime(e.target.value)}
                        disabled={!editMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Doctor Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Doctor/Attendant Name
                    </label>
                    <input
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      disabled={!editMode}
                      placeholder="Enter doctor or staff name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={showDiscount}
                        onChange={(e) => setShowDiscount(e.target.checked)}
                        disabled={!editMode}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Apply Discount</span>
                    </label>
                    {showDiscount && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                          disabled={!editMode}
                          placeholder="Discount amount"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      disabled={!editMode}
                      placeholder="Add any special instructions or notes..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  {/* Transaction Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-3">Transaction Summary</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items:</span>
                        <span className="font-medium">{selectedTransaction.items.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">KES {selectedTransaction.totalAmount.toFixed(2)}</span>
                      </div>
                      {showDiscount && discountAmount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount:</span>
                          <span className="font-medium">- KES {discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-gray-300">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="font-bold text-blue-600">KES {calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Print Button */}
                  <button
                    onClick={handlePrint}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Printer className="h-5 w-5" />
                    <span>Print {printType === 'invoice' ? 'Invoice' : 'Receipt'}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Select a transaction to print</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
