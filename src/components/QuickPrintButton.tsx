import React, { useState } from 'react';
import { Printer, FileText, Package, Users, DollarSign } from 'lucide-react';
import PrintManager from './PrintManager';

interface QuickPrintButtonProps {
  variant?: 'button' | 'icon' | 'fab';
  className?: string;
  context?: 'inventory' | 'patients' | 'transactions' | 'dashboard';
}

export default function QuickPrintButton({ 
  variant = 'button', 
  className = '',
  context 
}: QuickPrintButtonProps) {
  const [showPrintManager, setShowPrintManager] = useState(false);

  const getContextualPrint = () => {
    if (!context) return null;

    const contextActions = {
      inventory: () => printInventoryReport(),
      patients: () => printPatientSummary(),
      transactions: () => printFinancialReport(),
      dashboard: () => printDailyReport()
    };

    return contextActions[context];
  };

  const printInventoryReport = () => {
    const medications = JSON.parse(localStorage.getItem('clinic-medications') || '[]');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = generateInventoryPrintContent(medications);
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const printPatientSummary = () => {
    const patients = JSON.parse(localStorage.getItem('clinic-patients') || '[]');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = generatePatientSummaryContent(patients);
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const printFinancialReport = () => {
    const transactions = JSON.parse(localStorage.getItem('clinic-transactions') || '[]');
    const expenses = JSON.parse(localStorage.getItem('clinic-expenses') || '[]');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = generateFinancialReportContent(transactions, expenses);
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const printDailyReport = () => {
    const today = new Date().toDateString();
    const transactions = JSON.parse(localStorage.getItem('clinic-transactions') || '[]');
    const expenses = JSON.parse(localStorage.getItem('clinic-expenses') || '[]');
    
    const todayTransactions = transactions.filter((t: any) => new Date(t.date).toDateString() === today);
    const todayExpenses = expenses.filter((e: any) => new Date(e.date).toDateString() === today);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = generateDailyReportContent(todayTransactions, todayExpenses);
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const generateInventoryPrintContent = (medications: any[]) => {
    const clinicSettings = JSON.parse(localStorage.getItem('clinic-settings') || '{}');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Inventory Report</title>
          <style>${getQuickPrintStyles()}</style>
        </head>
        <body>
          <div class="header">
            <h1>${clinicSettings.clinicName || 'Haven Grace Medical Clinic'}</h1>
            <h2>Inventory Report</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
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
              ${medications.map(med => {
                const value = med.price * med.stock;
                const status = med.stock === 0 ? 'Out of Stock' : 
                             med.stock <= 5 ? 'Critical' : 
                             med.stock <= 15 ? 'Low Stock' : 'In Stock';
                
                return `
                  <tr>
                    <td>${med.name}</td>
                    <td>${med.category || 'N/A'}</td>
                    <td>${med.stock}</td>
                    <td>${med.price.toFixed(2)}</td>
                    <td>${value.toFixed(2)}</td>
                    <td class="status-${status.toLowerCase().replace(' ', '-')}">${status}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="4"><strong>Total Inventory Value:</strong></td>
                <td><strong>KES ${medications.reduce((sum, med) => sum + (med.price * med.stock), 0).toFixed(2)}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;
  };

  const generatePatientSummaryContent = (patients: any[]) => {
    const clinicSettings = JSON.parse(localStorage.getItem('clinic-settings') || '{}');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Summary</title>
          <style>${getQuickPrintStyles()}</style>
        </head>
        <body>
          <div class="header">
            <h1>${clinicSettings.clinicName || 'Haven Grace Medical Clinic'}</h1>
            <h2>Patient Summary Report</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Total Patients: ${patients.length}</p>
          </div>
          
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
              ${patients.map(p => `
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
        </body>
      </html>
    `;
  };

  const generateFinancialReportContent = (transactions: any[], expenses: any[]) => {
    const clinicSettings = JSON.parse(localStorage.getItem('clinic-settings') || '{}');
    const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Financial Report</title>
          <style>${getQuickPrintStyles()}</style>
        </head>
        <body>
          <div class="header">
            <h1>${clinicSettings.clinicName || 'Haven Grace Medical Clinic'}</h1>
            <h2>Financial Summary Report</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
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
              ${transactions.slice(0, 20).map(t => `
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
        </body>
      </html>
    `;
  };

  const generateDailyReportContent = (todayTransactions: any[], todayExpenses: any[]) => {
    const clinicSettings = JSON.parse(localStorage.getItem('clinic-settings') || '{}');
    const dailyRevenue = todayTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const dailyExpenseTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Daily Report</title>
          <style>${getQuickPrintStyles()}</style>
        </head>
        <body>
          <div class="header">
            <h1>${clinicSettings.clinicName || 'Haven Grace Medical Clinic'}</h1>
            <h2>Daily Operations Report - ${new Date().toLocaleDateString()}</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
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
              ${todayTransactions.map(t => `
                <tr>
                  <td>${new Date(t.date).toLocaleTimeString()}</td>
                  <td>${t.patientName || 'General Customer'}</td>
                  <td>${t.items.length}</td>
                  <td>${t.totalAmount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const getQuickPrintStyles = () => {
    return `
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        line-height: 1.4;
        color: #333;
      }
      
      .header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid #2563eb;
        padding-bottom: 20px;
      }
      
      .header h1 {
        color: #2563eb;
        margin: 0 0 10px 0;
        font-size: 24px;
      }
      
      .header h2 {
        margin: 10px 0;
        color: #374151;
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
      
      .status-out-of-stock { color: #dc2626; font-weight: bold; }
      .status-critical { color: #f59e0b; font-weight: bold; }
      .status-low-stock { color: #f59e0b; }
      .status-in-stock { color: #16a34a; }
      
      @media print {
        body { margin: 0; }
        .no-print { display: none !important; }
      }
      
      @page {
        margin: 1in;
      }
    `;
  };

  const contextualAction = getContextualPrint();

  if (variant === 'fab') {
    return (
      <>
        <button
          onClick={() => setShowPrintManager(true)}
          className={`fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 ${className}`}
          title="Print Documents"
        >
          <Printer className="h-6 w-6" />
        </button>
        {showPrintManager && (
          <PrintManager onClose={() => setShowPrintManager(false)} />
        )}
      </>
    );
  }

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={() => setShowPrintManager(true)}
          className={`p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${className}`}
          title="Print Documents"
        >
          <Printer className="h-5 w-5" />
        </button>
        {showPrintManager && (
          <PrintManager onClose={() => setShowPrintManager(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <div className={`flex space-x-2 ${className}`}>
        {contextualAction && (
          <button
            onClick={contextualAction}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            title={`Quick print ${context} report`}
          >
            <Printer className="h-4 w-4" />
            <span>Quick Print</span>
          </button>
        )}
        
        <button
          onClick={() => setShowPrintManager(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Printer className="h-4 w-4" />
          <span>Print Manager</span>
        </button>
      </div>
      
      {showPrintManager && (
        <PrintManager onClose={() => setShowPrintManager(false)} />
      )}
    </>
  );
}